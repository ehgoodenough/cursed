var WorldView = React.createClass({
    render: function() {
        return (
            <canvas ref="canvas"
                style={this.renderStyle()}
                width={this.props.data.width * px}
                height={this.props.data.height * px}/>
        )
    },
    renderStyle: function() {
        return {
            width: this.props.data.width + "em",
            height: this.props.data.height + "em",
        }
    },
    renderCanvas: function() {
        var canvas = jQuery(this.refs.canvas.getDOMNode())
        for(var coords in this.props.data.tiles) {
            var tile = this.props.data.tiles[coords]
            if(tile.isWall) {
                canvas.drawImage({
                    source: "./assets/images/tiles/wall" + tile.seed + "a.png",
                    fromCenter: false,
                    x: tile.x * px,
                    y: tile.y * px,
                    height: px,
                    width: px,
                })
            } else {
                canvas.drawRect({
                    fillStyle: "#352B31",
                    fromCenter: false,
                    x: tile.x * px,
                    y: tile.y * px,
                    height: px,
                    width: px,
                })
            }
        }
    },
    shouldComponentUpdate: function(props) {
        return false
    },
    componentDidMount: function() {
        this.renderCanvas()
    },
})

module.exports = WorldView
