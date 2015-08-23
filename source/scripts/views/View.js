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
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: "url(" + this.props.data.image + ")",
            backgroundColor: "rgba(" + (255 / 2) + ", 0, 0, 0.5)",
        }
    }
})

module.exports = View
