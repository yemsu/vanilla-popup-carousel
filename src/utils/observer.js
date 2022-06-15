export const mutationObserver = (elem, callback) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      callback(mutation)
    });
  });
  
  observer.observe(elem, {
    attributes: true,
    // childList: true,
    // characterData: true,
    // subtree: true || null,
    // attributeOldValue: true || null,
    // characterDataOldValue: true || null,
  })
}