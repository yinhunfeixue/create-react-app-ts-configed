/**
 * MoveController
 */
class MoveController {
    private _startPosition?: Position
    private _startSize?: Position

    constructor(public dragTarget: HTMLElement, public displayTarget: HTMLElement, public onChange: (value: Position) => void, public onStop?: () => void) {
        this.init()
    }

    private init() {
        this.dragTarget.addEventListener('mousedown', this.mouseDownHandler)
    }

    start() {
        document.body.addEventListener('mousemove', this.mouseMoveHandler)
        document.body.addEventListener('mouseup', this.mouseUpHandler)
        document.body.style.userSelect = 'none'
    }

    stop() {
        document.body.removeEventListener('mousemove', this.mouseMoveHandler)
        document.body.removeEventListener('mouseup', this.mouseUpHandler)
        document.body.style.userSelect = 'unset'
        if(this.onStop){
          this.onStop()
        }
    }

    mouseDownHandler = (event: MouseEvent) => {
        const { offsetWidth, offsetHeight } = this.displayTarget
        this._startPosition = this.getPositionFromEvent(event)
        this._startSize = new Position(offsetWidth, offsetHeight)
        this.start()
    }

    mouseMoveHandler = (event: MouseEvent) => {
        const currentPositon = this.getPositionFromEvent(event)
        const { _startSize, _startPosition } = this
        if (_startPosition && _startSize) {
            const { x, y } = _startPosition

            const changeValue = new Position(_startSize.x + currentPositon.x - x, _startSize.y + currentPositon.y - y)
            this.onChange(changeValue)
        } else {
            this.stop()
        }
    }

    mouseUpHandler = (event: MouseEvent) => {
        this.stop()
    }

    private getPositionFromEvent(event: MouseEvent) {
        const { pageX, pageY } = event
        return new Position(pageX, pageY)
    }
}

/**
 *
 */
class Position {
    constructor(public x: number = 0, public y: number = 0) {}
}
export default MoveController
