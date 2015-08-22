var View = React.createClass({
    render: function() {
        return (
            <div style={this.renderStyle()}/>
        )
    },
    renderStyle: function() {
        return {
            position: "absolute",
            width: this.props.data.width + "em",
            height: this.props.data.height + "em",
            top: this.props.data.y - (this.props.data.height / 2) + "em",
            left: this.props.data.x - (this.props.data.width / 2) + "em",
            transform: "rotate(" + this.props.data.r + "deg)",
            backgroundColor: "#C00",
        }
    }
})

module.exports = View
