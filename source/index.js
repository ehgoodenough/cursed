window.React = require("react")
window.Phlux = require("phlux")
window.Loop = require("<scripts>/utilities/Loop")
window.Input = require("<scripts>/utilities/Input")
window.Tiledmap = require("<scripts>/utilities/Tiledmap")

window.WIDTH = 16
window.HEIGHT = 9
window.px = 64

var map = new Tiledmap(require("<assets>/tilemaps/tilemap.json"))
window.World = {width: map.width, height: map.height, tiles: {}}
for(var x = 0; x < map.width; x++) {
    for(var y = 0; y < map.height; y++) {
        var tile = map.layers[0].tiles[x + "x" + y]
        var isWall = !!tile.properties && !!tile.properties.isWall
        var image = "./assets/images/tiles/floor.png"
        var seed = Math.ceil(Math.random() * 4)
        if(isWall) {
            image = "./assets/images/tiles/"
            image += "wall"
            image += seed
            image += "b"
            image += ".png"
        }
        World.tiles[x + "x" + y] = {
            x: x, y: y,
            image: image,
            isWall: isWall,
            seed: seed,
        }
    }
}

window.GameStore = Phlux.createStore({
    initiateStore: function() {
        this.data.archaeologist = {
            width: 1,
            height: 1,
            x: WIDTH / 2 + 0.5 - 0.5,
            y: HEIGHT / 2 + 0.5 - 0.5,
            image: "./assets/images/kid.svg",
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
                    <View data={this.state.game.archaeologist}/>
                </CameraView>
            </FrameView>
        )
    },
    componentDidMount: function() {
        Loop(function(tick) {
            var archaeologist = GameStore.data.archaeologist
            // player input
            if(Input.isDown("W")) {
                archaeologist.y -= tick * 3
            } else if(Input.isDown("S")) {
                archaeologist.y += tick * 3
            } if(Input.isDown("A")) {
                archaeologist.x -= tick * 3
            } else if(Input.isDown("D")) {
                archaeologist.x += tick * 3
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
