const Container = document.getElementById("container");
const PointsLabel = document.getElementById("points");
const StartButton = document.getElementById("startButton");
const EndButton = document.getElementById("endButton");
const Context = Container.getContext("2d");

const Items = [];
let Points = 0;
let IsGame = false;
let CurrentSnake;

const CONTROLS = [
    "W", "A", "S", "D", "ARROWUP", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT"
];
const GAME_WIDTH = Container.clientWidth;
const GAME_HEIGHT = Container.clientHeight;
const SNAKE_SIZE = 30;
const FOOD_SIZE = 30;
const TICK = 100;

class Snake {
    constructor(color, velocity, parts) {
        this.Color = color;
        this.Velocity = velocity;
        this.XVelocity = velocity;
        this.YVelocity = 0;
        this.Position = [
            {X: 0, Y: 0}
        ];
        for (let i = 1; i <= parts; i++) {
            this.Position.unshift({X: SNAKE_SIZE * i, Y: 0});
        }
    }
    Destroy() {
        CurrentSnake = null;
    }
}

class Item {
    constructor(color, size, position) {
        this.Color = color;
        this.Size = size;
        this.Position = position;
    }
}

function StartGame() {
    if (!IsGame) {
        IsGame = true;
        CurrentSnake = new Snake("lightblue", SNAKE_SIZE, 5);
        AddSnake();
        AddItem("red", FOOD_SIZE, GenerateCoordinates());
        GameTick();
    }
}

function EndGame() {
    if (IsGame) {
        alert("GAME OVER!");
        IsGame = false;
        Points = 0;
        CurrentSnake.Destroy();
        Items.splice(0, Items.length);
        CleanUp();
    }
}

function GameTick() {
    setTimeout(() => {
        CleanUp();
        PointsLabel.innerText = `${Points} Point(s)`;
        MoveSnake();
        CheckSnake();
        Items.forEach(item => {
            Context.fillStyle = item.Color;
            Context.fillRect(item.Position.X, item.Position.Y, item.Size, item.Size);
        })
        GameTick();
    }, TICK);
}

function MoveSnake() {
    const Head = {X: CurrentSnake.Position[0].X + CurrentSnake.XVelocity, Y: CurrentSnake.Position[0].Y + CurrentSnake.YVelocity}
    let gotFood = false;
    CurrentSnake.Position.unshift(Head);
    const IndexToRemove = Items.findIndex(item => {
        if (CurrentSnake.Position[0].X == item.Position.X && CurrentSnake.Position[0].Y == item.Position.Y) {
            gotFood = true;
        }
    })
    if (gotFood && IndexToRemove) {
        Items.splice(IndexToRemove, 1);
        AddItem("red", FOOD_SIZE, GenerateCoordinates());
        Points += 1;
    } else {
        CurrentSnake.Position.pop();
    }
    AddSnake();
}

function ChangeDirection(event) {
    const Key = GetKeyLabel(event.key.toUpperCase());
    if (CONTROLS.includes(event.key.toUpperCase())) {
        switch(true) {
            case(Key == "Up" && CurrentSnake.YVelocity != CurrentSnake.Velocity):
                CurrentSnake.XVelocity = 0;
                CurrentSnake.YVelocity = -CurrentSnake.Velocity;
                break;
            case(Key == "Down" && CurrentSnake.YVelocity != -CurrentSnake.Velocity):
                CurrentSnake.XVelocity = 0;
                CurrentSnake.YVelocity = CurrentSnake.Velocity;
                break;
            case(Key == "Left" && CurrentSnake.XVelocity != CurrentSnake.Velocity):
                CurrentSnake.XVelocity = -CurrentSnake.Velocity;
                CurrentSnake.YVelocity = 0;
                break;
            case(Key == "Right" && CurrentSnake.XVelocity != -CurrentSnake.Velocity):
                CurrentSnake.XVelocity = CurrentSnake.Velocity;
                CurrentSnake.YVelocity = 0;
                break;
        };
    }
}

function GetKeyLabel(key) {
    switch(true) {
        case(key == "W" || key == "ARROWUP"):
            return "Up";
        case(key == "S" || key == "ARROWDOWN"):
            return "Down";
        case(key == "A" || key == "ARROWLEFT"):
            return "Left";
        case(key == "D" || key == "ARROWRIGHT"):
            return "Right";
    };
}

function AddSnake() {
    Context.fillStyle = CurrentSnake.Color;
    Context.strokeStyle = "black";
    CurrentSnake.Position.forEach(part => {
        Context.fillRect(part.X, part.Y, SNAKE_SIZE, SNAKE_SIZE);
        Context.strokeRect(part.X, part.Y, SNAKE_SIZE, SNAKE_SIZE)
    });
}

function AddItem(color, size, position) {
    Context.fillStyle = color;
    Context.fillRect(position.X, position.Y, size, size);
    Items.push(new Item(color, size, position));
}

function GenerateCoordinates() {
    return {
        X: Math.round((Math.random() * GAME_WIDTH - SNAKE_SIZE) / SNAKE_SIZE) * SNAKE_SIZE,
        Y: Math.round((Math.random() * GAME_HEIGHT - SNAKE_SIZE) / SNAKE_SIZE) * SNAKE_SIZE
    };
}

function CheckSnake() {
    switch(true) {
        case(CurrentSnake.Position[0].X < 0):
            EndGame();
            break;
        case(CurrentSnake.Position[0].X >= GAME_WIDTH):
            EndGame();
            break;
        case(CurrentSnake.Position[0].Y < 0):
            EndGame();
            break;
        case(CurrentSnake.Position[0].Y >= GAME_HEIGHT):
            EndGame();
            break;
    }
    for (let i = 1; i < CurrentSnake.Position.length; i++) {
        if (CurrentSnake.Position[0].X == CurrentSnake.Position[i].X && CurrentSnake.Position[0].Y == CurrentSnake.Position[i].Y) {
            EndGame();
            break;
        }
    }
}

function CleanUp() {
    Context.fillStyle = "white";
    Context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

StartButton.addEventListener("click", StartGame);
EndButton.addEventListener("click", EndGame);

window.addEventListener("keydown", ChangeDirection);
