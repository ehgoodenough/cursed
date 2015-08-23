var size = 8

var View = React.createClass({
    render: function() {
        return (
            <div>
                <canvas ref="flashlight"
                    width={size * px} height={size * px}
                    style={this.renderFlashlightStyle()}/>
                <div ref="entity" style={this.renderEntityStyle()}/>
            </div>
        )
    },
    renderEntityStyle: function() {
        return {
            position: "absolute",
            width: this.props.data.width + "em",
            height: this.props.data.height + "em",
            top: this.props.data.y - (this.props.data.height / 2) + "em",
            left: this.props.data.x - (this.props.data.width / 2) + "em",
            transform: "rotate(" + this.props.data.r + "deg)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: this.props.data.color,
        }
    },
    renderFlashlightStyle: function() {
        return {
            width: size + "em",
            height: size + "em",
            position: "absolute",
            top: this.props.data.y - (size / 2) + "em",
            left: this.props.data.x - (size / 2) + "em",
            //backgroundColor: "rgba(155, 0, 0, 0.15)",
        }
    },
    renderFlashlightCanvas: function() {
        var canvas = jQuery(this.refs.flashlight.getDOMNode())
        canvas.restoreCanvas()
        canvas.clearCanvas()
        var line = {
            mask: true,
            closed: true,
            rounded: true,
            opacity: 0.5,
            fillStyle: "#C7D3B7",
        }
        var x = (size / 2) * px
        var y = (size / 2) * px
        line["x1"] = x
        line["y1"] = y
        var index = 2
        var max_arc = 60
        var max_radius = 3.5
        var angle = this.props.data.r - 90
        for(var arc = -(max_arc / 2); arc <= +(max_arc / 2); arc += 2) {
            var arc_x = Math.cos((angle + arc) * Math.PI / 180)
            var arc_y = Math.sin((angle + arc) * Math.PI / 180)
            var max_radius = 3.5
            for(var radius = 0; radius < max_radius; radius += 0.05) {
                var tile_x = Math.floor(this.props.data.x - (arc_x * radius))
                var tile_y = Math.floor(this.props.data.y - (arc_y * radius))
                var tile = World.tiles[tile_x + "x" + tile_y]
                if(!!tile && !!tile.isWall) {
                    max_radius = radius
                    break
                }
            }
            line["x" + index] = x - (arc_x * max_radius * px)
            line["y" + index] = y - (arc_y * max_radius * px)
            index += 1
        }
        canvas.drawLine(line)

        var monster_x = this.props.monster.x - (this.props.data.x - (size / 2))
        var monster_y = this.props.monster.y - (this.props.data.y - (size / 2))
        console.log(monster_x)
        canvas.drawRect({
            x: monster_x * px,
            y: monster_y * px,
            fillStyle: this.props.monster.color,
            width: this.props.monster.width * px,
            height: this.props.monster.height * px,
        })
    },
    componentDidUpdate: function() {
        this.renderFlashlightCanvas()
    }
})

module.exports = View
