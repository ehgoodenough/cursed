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
        if(x < 0) {
            x = 0
        } if(y < 0) {
            y = 0
        } if(x > this.props.bounds.width - WIDTH) {
            x = this.props.bounds.width - WIDTH
        } if(y > this.props.bounds.height - HEIGHT) {
            y = this.props.bounds.height - HEIGHT
        }
        return {
            top: y * -1 + "em",
            left: x * -1 + "em",
            position: "absolute",
        }
    }
})

module.exports = CameraView
