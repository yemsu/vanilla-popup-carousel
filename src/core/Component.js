export default class Component {
  $target;
  $state;
  $props;
  $el;
  $template;
  constructor ($target, $props) {
    this.$target = $target
    this.$props = $props
    this.$el = {}

    this.setup()
    this.render()
    this.setNodeSelector()
    this.mounted()
  }
  setup () {}
  setDefaultProps(defaultProps) {
    const keys = Object.keys(defaultProps)
    keys.forEach(key => {
      this.$props[key] = this.$props[key] ?? defaultProps[key]
    })
  }
  template () {}
  setNodeSelector() {}
  render () {
    console.log('render')
    this.$template = this.template()
    this.$target.appendChild(this.$template)
  }
  mounted () {}
  setEvent (target, eventName, callback) {
    target.addEventListener(eventName, (e) => {
      callback(e)
    })
  }
  setState (newState) {
    this.$state = { ...this.$state, ...newState }
  }
}