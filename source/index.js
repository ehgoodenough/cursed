window.React = require("react")
window.Phlux = require("phlux")
window.Loop = require("<scripts>/utilities/Loop")
window.Input = require("<scripts>/utilities/Input")
window.Tiledmap = require("<scripts>/utilities/Tiledmap")

window.WIDTH = 16
window.HEIGHT = 9

var map = new Tiledmap(require("<assets>/tilemaps/tilemap.json"))
var World = {width: map.width, height: map.height, tiles: {}}
for(var x = 0; x < map.width; x++) {
    for(var y = 0; y < map.height; y++) {
        var tile = map.layers[0].tiles[x + "x" + y]
        var isWall = !!tile.properties && !!tile.properties.isWall
        World.tiles[x + "x" + y] = {
            x: x, y: y,
            isWall: isWall,
            color: !isWall ? "#EEE" : "#111",
        }
    }
}

var GameStore = Phlux.createStore({
    initiateStore: function() {
        this.data.archaeologist = {
            width: 1,
            height: 1,
            x: WIDTH / 2,
            y: HEIGHT / 2 + 1.5,
        }
    }
})

var View = require("<scripts>/views/View")
var WorldView = require("<scripts>/views/WorldView")
var FrameView = require("<scripts>/views/FrameView")

var GameView = React.createClass({
    mixins: [
        Phlux.connectStore(GameStore, "game")
    ],
    render: function() {
        return (
            <FrameView aspect-ratio="16x9">
                <WorldView data={World}/>
                <View data={this.state.game.archaeologist}/>
            </FrameView>
        )
    },
    componentDidMount: function() {
        Loop(function(tick) {
            if(Input.isDown("W")) {
                GameStore.data.archaeologist.y -= tick * 3
            } else if(Input.isDown("S")) {
                GameStore.data.archaeologist.y += tick * 3
            } if(Input.isDown("A")) {
                GameStore.data.archaeologist.x -= tick * 3
            } else if(Input.isDown("D")) {
                GameStore.data.archaeologist.x += tick * 3
            }
            GameStore.trigger()
        })
    }
})

React.render(<GameView/>, document.body)
