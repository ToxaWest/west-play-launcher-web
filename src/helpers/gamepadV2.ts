const scrollBooster = 15;
const keyMapping = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home' ,'top', 'bottom', 'left', 'right', ]

interface GamepadEventDetail {
    button: string;
    buttonIndex?: number;
    direction?: {
        horizontal: 'left' | 'right' | null;
        vertical: 'up' | 'down' | null;
    };
    time: number;
    value?: {
        horizontal: number;
        vertical: number;
    };
}

class GamepadV2 {
    gamepads: number[] = [];
    stickPress: { [key: string]: number | boolean } = {};

    addGamepad(gamepad: Gamepad) {
        console.log('GamePad connected:', gamepad.id);
        this.gamepads.push(gamepad.index);
        this.init(gamepad.index);
    }

    removeGamepad(gamepad: Gamepad) {
        console.log('remove:', gamepad.id);
        this.gamepads = this.gamepads.filter(index => index !== gamepad.index);
    }

    stickAction = (button: string, vertical: number, horizontal: number) => {
        if (Math.abs(vertical) > 0.5 || Math.abs(horizontal) > 0.5) {
            const event = new CustomEvent<GamepadEventDetail>('gamePadV2', {
                detail: {
                    button,
                    direction: {
                        horizontal: Math.abs(horizontal) > 0.5 ? (horizontal > 0 ? 'right' : 'left') : null,
                        vertical: Math.abs(vertical) > 0.5 ? (vertical > 0 ? 'down' : 'up') : null
                    },
                    time: new Date().getTime(),
                    value: {horizontal, vertical}
                }
            });
            document.dispatchEvent(event);
        }
    }

    init = (gamePadIndex: number, prevState: { [key: number]: boolean } = {}) => {
        if (!this.gamepads.includes(gamePadIndex)) {
            setTimeout(() => window.requestAnimationFrame(() => this.init(gamePadIndex, {})))
            return;
        }
        const gamepad = navigator.getGamepads()[gamePadIndex];
        if (!gamepad) return;

        const {axes: [lh, lv, rh, rv], buttons} = gamepad;
        const pressed = buttons.reduce((acc, button, index) => {
            acc[index] = button.pressed;
            return acc;
        }, {} as { [key: number]: boolean });

        for (const key in prevState) {
            if (prevState[key] !== pressed[key] && pressed[key]) {
                const event = new CustomEvent<GamepadEventDetail>('gamePadV2', {
                    detail: {button: keyMapping[key], buttonIndex: parseInt(key), time: new Date().getTime()}
                });
                document.dispatchEvent(event);
            }
        }

        const stickPress = {
            17: (lv < 0 && Math.abs(lv) > 0.5) ? new Date().getTime() : false,
            18: (lv > 0 && Math.abs(lv) > 0.5) ? new Date().getTime() : false,
            19: (lh < 0 && Math.abs(lh) > 0.5) ? new Date().getTime() : false,
            20: (lh > 0 && Math.abs(lh) > 0.5) ? new Date().getTime() : false,
        }

        Object.entries(stickPress).forEach(([key, value]) => {
            if (value) {
                if (!this.stickPress[key]) {
                    const event = new CustomEvent<GamepadEventDetail>('gamePadV2', {
                        detail: {button: keyMapping[key], buttonIndex: parseInt(key), time: new Date().getTime()}
                    });
                    document.dispatchEvent(event);
                    this.stickPress[key] = value;
                } else if ((value as number) - (this.stickPress[key] as number) >= 350) {
                    const event = new CustomEvent<GamepadEventDetail>('gamePadV2', {
                        detail: {button: keyMapping[key], buttonIndex: parseInt(key), time: new Date().getTime()}
                    });
                    document.dispatchEvent(event);
                    this.stickPress[key] = value;
                }
            } else this.stickPress[key] = value;
        })
        
        this.stickAction('RS', rv, rh)
        setTimeout(() => window.requestAnimationFrame(() => this.init(gamePadIndex, pressed)))
    }

    getScrollableParent(element: Element): Element {
        let parent = element.parentElement;
        while (parent) {
            const style = window.getComputedStyle(parent);
            if (style.overflowY === 'scroll' || style.overflowY === 'auto') {
                if (parent.scrollHeight > parent.clientHeight) return parent;
            }
            parent = parent.parentElement;
        }
        return document.querySelector(':root');
    }

    getScrollableParentX(element: Element): Element {
        let parent = element.parentElement;
        while (parent) {
            const style = window.getComputedStyle(parent);
            if (style.overflowX === 'scroll' || style.overflowX === 'auto') {
                if (parent.scrollWidth > parent.clientWidth) return parent;
            }
            parent = parent.parentElement;
        }
        return document.querySelector(':root');
    }

    scroll = () => {
        this.on('RS', ({value}) => {
            this.getScrollableParent(document.activeElement).scrollTop += value.vertical * scrollBooster;
            this.getScrollableParentX(document.activeElement).scrollLeft += value.horizontal * scrollBooster;
        })
    }

    on = (type: string, listener: (detail: GamepadEventDetail) => void) => {
        document.addEventListener('gamePadV2', (e: CustomEvent<GamepadEventDetail>) => {
            const { detail } = e;
            if (type === detail.button) {
                listener(detail)
            }
            if (type === 'all') {
                listener(detail)
            }
            if (type === 'button' && typeof detail.buttonIndex === 'number' && keyMapping.includes(detail.button)) {
                listener(detail)
            }
        });
    }
}

export default new GamepadV2()