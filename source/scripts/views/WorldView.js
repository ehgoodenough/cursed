var px = 64

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
        var canvas = this.getCanvas()
        for(var coords in this.props.data.tiles) {
            var tile = this.props.data.tiles[coords]
            canvas.fillStyle = "#111"
            canvas.textAlign = "center"
            canvas.fillText(tile.x + "x" + tile.y, (tile.x + 0.5) * px, (tile.y + 0.5) * px)
            canvas.fillStyle = tile.color
            canvas.fillRect(tile.x * px, tile.y * px, px, px)
        }
    },
    getCanvas: function() {
        return this.refs.canvas.getDOMNode().getContext("2d")
    },
    shouldComponentUpdate: function(props) {
        return false
    },
    componentDidMount: function() {
        this.renderCanvas()
    },
})

module.exports = WorldView
