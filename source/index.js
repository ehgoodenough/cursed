window.React = require("react")
window.Phlux = require("phlux")
window.jQuery = require("jquery")
window.jCanvas = require("jcanvas")(jQuery, window)
window.Firebase = require("firebase")
window.ShortID = require("shortid")

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
        var isWall = !!tile && !!tile.properties && !!tile.properties.isWall
        var seed = Math.ceil(Math.random() * 4)
        World.tiles[x + "x" + y] = {
            x: x, y: y,
            isWall: isWall,
            seed: seed,
        }
    }
}

var firebase = new Firebase("https://opob.firebaseio.com/")

window.GameStore = Phlux.createStore({
    initiateStore: function() {
        firebase.on("value", function(data) {
            this.data = data.val()
            this.trigger()
        }.bind(this))
    }
})

/*
    data: {
        archaeologist: {
            width: 1,
            height: 1,
            x: 7,
            y: 10,
            color: Colors[3]
        },
        monster: {
            x: 9 + 0.5,
            y: 10 + 0.5,
            width: 0.75,
            height: 0.75,
            color: Colors[1]
        }
    },
*/

var View = require("<scripts>/views/View")
var WorldView = require("<scripts>/views/WorldView")
var FrameView = require("<scripts>/views/FrameView")
var CameraView = require("<scripts>/views/CameraView")

var GameView = React.createClass({
    mixins: [
        Phlux.connectStore(GameStore, "game")
    ],
    render: function() {
        var player = null
        if(!!this.state.game
        && !!this.state.game.players) {
            player = this.state.game.players[myid]
        }
        return (
            <FrameView aspect-ratio="16x9">
                <CameraView target={player} bounds={World}>
                    <WorldView data={World}/>
                    {this.renderPlayers()}
                </CameraView>
            </FrameView>
        )
    },
    renderPlayers: function() {
        var renderings = []
        if(!!this.state.game
        && !!this.state.game.players) {
            for(var id in this.state.game.players) {
                var player = this.state.game.players[id]
                renderings.push(
                    <View key={id}
                        data={player}
                        monster={{}}/>
                )
            }
        }
        return renderings
    },
    componentDidMount: function() {
        window.myid = ShortID.generate()
        firebase.child("players").child(myid).set({
            id: myid,
            x: 2,
            y: 2,
            r: 0,
        })
        firebase.child("players").child(myid).onDisconnect().remove()
        Loop(function(tick) {
            if(!this.state.game
            || !this.state.game.players) {
                return
            }
            var player = this.state.game.players[myid]
            var vx = 0
            var vy = 0
            if(Input.isDown("W")) {
                vy = -3 * tick
            } else if(Input.isDown("S")) {
                vy = +3 * tick
            } if(Input.isDown("A")) {
                vx = -3 * tick
            } else if(Input.isDown("D")) {
                vx = +3 * tick
            }
            var tx = Math.floor(player.x)
            var ty = Math.floor(player.y + vy)
            if(!!World.tiles[tx + "x" + ty]
            && !World.tiles[tx + "x" + ty].isWall) {
                player.y += vy
            }
            ty = Math.floor(player.y)
            tx = Math.floor(player.x + vx)
            if(!!World.tiles[tx + "x" + ty]
            && !World.tiles[tx + "x" + ty].isWall) {
                player.x += vx
            }
            var mx = Input.mouse.x + Math.max(0, Math.min(player.x - (WIDTH / 2), World.width - WIDTH))
            var my = Input.mouse.y + Math.max(0, Math.min(player.y - (HEIGHT / 2), World.height - HEIGHT))
            player.r = (Math.atan2(my - player.y, mx - player.x) * 180 / Math.PI) - 90
            firebase.child("players").child(player.id).update(player)
        }.bind(this))
    }
})

React.render(<GameView/>, document.body)
