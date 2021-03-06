module.exports = (React = window.React) => {
  if (!React) throw new Error('cannot find React')

  return {
    init: (client) => {
      class ErrorBoundary extends React.Component {
        componentDidCatch (error, info) {
          const BugsnagReport = client.BugsnagReport
          const handledState = { severity: 'error', unhandled: true, severityReason: { type: 'unhandledException' } }
          const report = new BugsnagReport(error.name, error.message, BugsnagReport.getStacktrace(error), handledState)
          if (info && info.componentStack) info.componentStack = formatComponentStack(info.componentStack)
          report.updateMetaData('react', info)
          client.notify(report)
        }
        render () {
          return this.props.children
        }
      }
      return ErrorBoundary
    }
  }
}

const formatComponentStack = str => {
  const lines = str.split(/\s*\n\s*/g)
  let ret = ''
  for (let line = 0, len = lines.length; line < len; line++) {
    if (lines[line].length) ret += `${ret.length ? '\n' : ''}${lines[line]}`
  }
  return ret
}

module.exports.formatComponentStack = formatComponentStack
