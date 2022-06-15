export default class Component {
  $target;
  $state;
  $props;
  constructor ($target, $props = {}, autoMounted = true) {
    this.$target = $target
    this.$props = $props
    this.autoMounted = autoMounted

    this.init()
  }
  async init() {
    await this.setup()
    this.render()
    this.autoMounted && this.mounted()
  }
  setup () {}
  setDefaultProps(defaultProps) {
    const keys = Object.keys(defaultProps)
    keys.forEach(key => {
      this.$props[key] = this.$props[key] ?? defaultProps[key]
    })
  }
  template () { return '' }
  render () {
    // console.log('render', this,this.template())
    this.template() && this.$target.appendChild(this.template())
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