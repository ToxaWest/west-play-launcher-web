export const modalIsActive = (callback : (addedNodes: number) => void) => {
    const observer = new MutationObserver(([{addedNodes}]) => {
        callback(addedNodes.length)
    });
    observer.observe(document.querySelector('#modal'), {childList: true})
}