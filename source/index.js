window.React = require("react")
window.Phlux = require("phlux")

var GameStore = Phlux.createStore({
    data: {
        //?!
    }
})

var View = require("<scripts>/views/View")
var FrameView = require("<scripts>/views/FrameView")

var GameView = React.createClass({
    mixins: [
        Phlux.connectStore(GameStore, "game")
    ],
    render: function() {
        return (
            <FrameView aspect-ratio="16x9">
                <View></View>
            </FrameView>
        )
    }
})

React.render(<GameView/>, document.body)
