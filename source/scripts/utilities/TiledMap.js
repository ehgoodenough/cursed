var TiledMap = function(protomap) {
    var map = this

    if(protomap.version != "1") {
        throw "Unsupported Version"
    } if(protomap.orientation != "orthogonal") {
        throw "Unsupported Orientation"
    } if(protomap.renderorder != "right-down") {
        throw "Unsupported RenderOrder"
    }

    var Tile = function(prototile) {
        this.image = prototile.image

        if(prototile.properties != undefined
        && Object.keys(prototile.properties).length > 0) {
            this.properties = new Object()
            for(var key in prototile.properties) {
                var value = prototile.properties[key]
                this.properties[key] = value
            }
        }
    }

    var Tileset = function(prototileset) {
        this.name = prototileset.name

        if(prototileset.properties != undefined
        && Object.keys(prototileset.properties).length > 0) {
            this.properties = new Object()
            for(var key in prototileset.properties) {
                var value = prototileset.properties[key]
                this.properties[key] = value
            }
        }

        var tilewidth = prototileset.tilewidth
        var tileheight = prototileset.tileheight
        var imagewidth = prototileset.imagewidth
        var imageheight = prototileset.imageheight
        var imagemargin = prototileset.imagemargin || 0
        var imagespacing = prototileset.imagespacing || 0
        var tileproperties = prototileset.tileproperties || {}

        this.width = (imagewidth - imagemargin + imagespacing) / (tilewidth + imagespacing)
        this.height = (imageheight - imagemargin + imagespacing) / (tileheight + imagespacing)
        this.tilewidth = tilewidth
        this.tileheight = tileheight

        this.firstgid = prototileset.firstgid
        this.lastgid = this.firstgid + (this.width * this.height)

        this.tiles = new Object()
        for(var gid = this.firstgid; gid <= this.lastgid; gid++) {
            map.tiles[gid] = this.tiles[gid] = new Tile({
                "image": {
                    "width": tilewidth,
                    "height": tileheight
                },
                "properties": tileproperties[gid - 1],
                "gid": gid
            })
        }
    }

    var Layer = function(protolayer) {
        this.name = protolayer.name

        if(protolayer.properties != undefined
        && Object.keys(protolayer.properties).length > 0) {
            this.properties = new Object()
            for(var key in protolayer.properties) {
                var value = protolayer.properties[key]
                this.properties[key] = value
            }
        }

        this.opacity = protolayer.opacity
        this.visible = protolayer.visible

        this.tiles = new Object()
        for(var x = 0; x < protolayer.width; x++) {
            for(var y = 0; y < protolayer.height; y++) {
                var gid = protolayer.data[y * protolayer.width + x]
                this.tiles[x + "x" + y] = map.tiles[gid]
            }
        }
    }

    this.width = protomap.width
    this.height = protomap.height
    this.tilewidth = protomap.tilewidth
    this.tileheight = protomap.tileheight

    if(protomap.backgroundcolor != undefined) {
        this.color = protomap.backgroundcolor
    }

    if(protomap.properties != undefined
    && Object.keys(protomap.properties).length > 0) {
        this.properties = new Object()
        for(var key in protomap.properties) {
            var value = protomap.properties[key]
            this.properties[key] = value
        }
    }

    this.tiles = new Object()
    this.layers = new Object()
    this.tilesets = new Object()

    for(var index in protomap.tilesets) {
        var prototileset = protomap.tilesets[index]
        this.tilesets[index] = new Tileset(prototileset)
    }

    for(var index in protomap.layers) {
        var protolayer = protomap.layers[index]
        this.layers[index] = new Layer(protolayer)
    }
}

// the following features
// are not supported yet:
// - map
//   - renderorder [!!]
//   - non-json formats
// - objectgroup
// - imagelayer
// - tileset
//   - images [!!]
//   - terraintypes
// - layer
//   - data
//     - encoding

module.exports = TiledMap
