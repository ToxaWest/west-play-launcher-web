export const modalIsActive = (callback) => {
    const observer = new MutationObserver(([{addedNodes}]) => {
        callback(addedNodes.length)
    });
    observer.observe(document.querySelector('#modal'), {childList: true})
}