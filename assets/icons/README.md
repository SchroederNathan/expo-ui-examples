# Icons

Android XML vector drawables for `<Icon>` from `@expo/ui/jetpack-compose`. Metro
bundles `.xml` assets directly, so these are `require()`d like any other asset.

These come from [Material Symbols](https://fonts.google.com/icons), whose SVGs use a
`0 -960 960 960` viewBox. The usual way to handle the negative origin is to wrap the
path in `<group android:translateY="960">`, but `@expo/ui`'s vector loader parses
`<path>` elements only — groups, clips and gradients are ignored — so the offset has
to be baked into the path data instead.

`scripts/material-symbol.mjs` does that: it fetches the symbol, shifts the Y
coordinate of every *absolute* path command by +960 (relative commands are already
offsets, so they're left alone) and writes the drawable.

```sh
node scripts/material-symbol.mjs palette assets/icons/palette.xml
```

Each path is written with an explicit black `fillColor`. That is not the colour you
get: the loader hands `fillColor` straight to the path's fill brush and a path with
no brush paints nothing at all, so it has to be set. `<Icon tint>` recolours the
result with a `ColorFilter` on top; omit `tint` and it picks up the surrounding
`LocalContentColor`.
