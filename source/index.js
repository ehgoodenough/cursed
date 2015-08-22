window.React = require("react")

var GameFrame = require("<scripts>/views/GameFrame")

var Game = React.createClass({
    render: function() {
        return (
            <GameFrame>
                Hello World!!
            </GameFrame>
        )
    }
})

React.render(<Game/>, document.body)
