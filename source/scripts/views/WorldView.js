window.jQuery = require("jquery")
window.jCanvas = require("jcanvas")(jQuery, window)

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
            canvas.drawImage({
                width: px,
                height: px,
                x: tile.x * px,
                y: tile.y * px,
                fromCenter: false,
                source: tile.image,
            })
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
