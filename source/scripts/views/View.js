var View = React.createClass({
    render: function() {
        return (
            <div>
                <canvas ref="flashlight"
                    width={9 * px} height={9 * px}
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
            //backgroundImage: "url(" + this.props.data.image + ")",
            backgroundColor: "#C00",
        }
    },
    renderFlashlightStyle: function() {
        return {
            width: "9em",
            height: "9em",
            position: "absolute",
            top: Math.floor(this.props.data.y) - 4 + "em",
            left: Math.floor(this.props.data.x) - 4 + "em",
            //backgroundColor: "rgba(155, 0, 0, 0.5)",
        }
    },
    renderFlashlight: function() {
        var x = Math.floor(this.props.data.x)
        var y = Math.floor(this.props.data.y)
        var canvas = jQuery(this.refs.flashlight.getDOMNode())
        canvas.clearCanvas()
        canvas.drawSlice({
            fillStyle: "orange",
            x: (this.props.data.x - x + 4) * px,
            y: (this.props.data.y - y + 4) * px,
            radius: 200,
            start: this.props.data.r + 180 - 40,
            end: this.props.data.r + 180 + 40,
            mask: true,
        })
        for(var tx = x - 4; tx <= x + 4; tx++) {
            for(var ty = y - 4; ty <= y + 4; ty++) {
                var tile = World.tiles[tx + "x" + ty]
                if(!tile) {continue}
                if(!tile.isWall) {continue}
                canvas.drawImage({
                    width: px,
                    height: px,
                    x: (tx - x + 4) * px,
                    y: (ty - y + 4) * px,
                    fromCenter: false,
                    source: "./assets/images/tiles/wall" + tile.seed + "a.png",
                })
            }
        }
        canvas.restoreCanvas()
    },
    componentDidUpdate: function() {
        this.renderFlashlight()
    }
})

module.exports = View
