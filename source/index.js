window.React = require("react")
window.Phlux = require("phlux")
window.jQuery = require("jquery")
window.jCanvas = require("jcanvas")(jQuery, window)
window.Loop = require("<scripts>/utilities/Loop")
window.Input = require("<scripts>/utilities/Input")
window.Tiledmap = require("<scripts>/utilities/Tiledmap")

window.WIDTH = 16
window.HEIGHT = 9
window.px = 64

window.Colors = {
    1: "#0A1E31", //#1
    2: "#1F3C4E", //#2
    3: "#82AB8E", //#3
    4: "#AABF9C", //#4
    5: "#C7D3B7", //#5
}

var map = new Tiledmap(require("<assets>/tilemaps/tilemap.json"))
window.World = {width: map.width, height: map.height, tiles: {}}
for(var x = 0; x < map.width; x++) {
    for(var y = 0; y < map.height; y++) {
        var tile = map.layers[0].tiles[x + "x" + y]
        var isWall = !!tile.properties && !!tile.properties.isWall
        var seed = Math.ceil(Math.random() * 4)
        World.tiles[x + "x" + y] = {
            x: x, y: y,
            isWall: isWall,
            seed: seed,
        }
    }
}

window.GameStore = Phlux.createStore({
    data: {
        archaeologist: {
            width: 1,
            height: 1,
            x: 7 + 0.5,
            y: 10 + 0.5,
            color: Colors[3]
        },
        monster: {
            x: 9 + 0.5,
            y: 10 + 0.5,
            width: 1.5,
            height: 1.5,
            color: Colors[1]
        }
    }
})

var View = require("<scripts>/views/View")
var WorldView = require("<scripts>/views/WorldView")
var FrameView = require("<scripts>/views/FrameView")
var CameraView = require("<scripts>/views/CameraView")

var GameView = React.createClass({
    mixins: [
        Phlux.connectStore(GameStore, "game")
    ],
    render: function() {
        return (
            <FrameView aspect-ratio="16x9">
                <CameraView target={this.state.game.archaeologist} bounds={World}>
                    <WorldView data={World} target={this.state.game.archaeologist}/>
                    <View data={this.state.game.archaeologist} monster={this.state.game.monster}/>
                </CameraView>
            </FrameView>
        )
    },
    componentDidMount: function() {
        Loop(function(tick) {
            var archaeologist = GameStore.data.archaeologist
            if(Input.isDown("W")) {
                archaeologist.vy = -3 * tick
            } else if(Input.isDown("S")) {
                archaeologist.vy = +3 * tick
            } else {
                archaeologist.vy = 0
            } if(Input.isDown("A")) {
                archaeologist.vx = -3 * tick
            } else if(Input.isDown("D")) {
                archaeologist.vx = +3 * tick
            } else {
                archaeologist.vx = 0
            }
            var tx = Math.floor(archaeologist.x)
            var ty = Math.floor(archaeologist.y + archaeologist.vy)
            if(!!World.tiles[tx + "x" + ty]
            && !World.tiles[tx + "x" + ty].isWall) {
                archaeologist.y += archaeologist.vy
            } else {
                archaeologist.vy = 0
            }
            tx = Math.floor(archaeologist.x + archaeologist.vx)
            ty = Math.floor(archaeologist.y + archaeologist.vy)
            if(!!World.tiles[tx + "x" + ty]
            && !World.tiles[tx + "x" + ty].isWall) {
                archaeologist.x += archaeologist.vx
            } else {
                archaeologist.vx = 0
            }

            var mx = Input.mouse.x
            var my = Input.mouse.y
            var cx = archaeologist.x - (WIDTH / 2)
            var cy = archaeologist.y - (HEIGHT / 2)
            cx = Math.max(0, Math.min(cx, World.width - WIDTH))
            cy = Math.max(0, Math.min(cy, World.height - HEIGHT))
            mx += cx
            my += cy

            var r = Math.atan2(my - archaeologist.y, mx - archaeologist.x) * 180 / Math.PI

            GameStore.data.archaeologist.r = r - 90
            GameStore.trigger()
        })
    }
})

React.render(<GameView/>, document.body)
