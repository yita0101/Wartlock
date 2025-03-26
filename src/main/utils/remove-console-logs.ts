export const removeConsoleLogs = (): void => {
  const consoleMethods = [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'markTimeline',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeline',
    'timelineEnd',
    'timeStamp',
    'trace',
    'warn',
  ]

  if (import.meta.env.PROD) {
    consoleMethods.forEach((method) => {
      console[method] = (): void => {}
    })
  }
}
