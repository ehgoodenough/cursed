var CameraView = React.createClass({
    render: function() {
        return (
            <div style={this.renderStyle()}>
                {this.props.children}
            </div>
        )
    },
    renderStyle: function() {
        var x = this.props.target.x - (WIDTH / 2)
        var y = this.props.target.y - (HEIGHT / 2)
        x = Math.max(0, Math.min(x, this.props.bounds.width - WIDTH))
        y = Math.max(0, Math.min(y, this.props.bounds.height - HEIGHT))
        return {
            top: y * -1 + "em",
            left: x * -1 + "em",
            position: "absolute",
        }
    }
})

module.exports = CameraView
