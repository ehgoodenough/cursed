window.React = require("react")
window.Phlux = require("phlux")
window.Loop = require("<scripts>/utilities/Loop")
window.Input = require("<scripts>/utilities/Input")

window.WIDTH = 16
window.HEIGHT = 9

var GameStore = Phlux.createStore({
    data: {
        width: 1,
        height: 1,
        x: WIDTH / 2,
        y: HEIGHT / 2,
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
                <View data={this.state.game}/>
            </FrameView>
        )
    },
    componentDidMount: function() {
        Loop(function(tick) {
            if(Input.isDown("W")) {
                GameStore.data.y -= tick * 3
            } else if(Input.isDown("S")) {
                GameStore.data.y += tick * 3
            } if(Input.isDown("A")) {
                GameStore.data.x -= tick * 3
            } else if(Input.isDown("D")) {
                GameStore.data.x += tick * 3
            }
            GameStore.trigger()
        })
    }
})

React.render(<GameView/>, document.body)
