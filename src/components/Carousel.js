import '@/scss/components/Carousel.scss'
import {checkLoad, domSetActiveIndex} from '@/utils'
import Component from '@/core/Component'
// import { observe, observable } from '../core/Observer'
export default class Carousel extends Component {
  setup() {
    this.setDefaultProps({
      type: null,
      arrows: true,
      indicators: true,
      slideNumPerView: 1,
      slideNumPerSliding: 1
    })

    const {dataList, slideNumPerSliding} = this.$props
    this.$state = {
      activeIndex: 0,
      contentsArea: null,      
      lastIndex: Math.ceil(dataList.length / slideNumPerSliding) - 1
    }
    console.log(this)
  }
  template() {
    const {dataList, arrows, indicators, type, slideNumPerView} = this.$props
    const {activeIndex, lastIndex} = this.$state
    const carousel = document.createElement('div')
    carousel.classList.add('carousel')

    const slideTemplate = (data, i) => {
      const {img, alt, tit, description, cloned} = data
      const clonedClass = cloned ? ' cloned' : ''
      const cloneDataIndex = i === 0 ? lastIndex : 0
      const centerTypeDataIndex = cloned ? cloneDataIndex : i - 1 
      const dataIndex = type === 'center' ? centerTypeDataIndex : i
      const checkActive = type === 'center' ? Math.floor(slideNumPerView / 2) : activeIndex
      const activeClass = i === checkActive ? ' active' : ''
      return `
      <div class='slide${activeClass}${clonedClass}'> 
        <button data-index="${dataIndex}">
          <div class="wrap-img">
            <img src='${img}' alt='${alt ?? ''}' />
          </div>
          ${tit && `<p class='title'>${tit}</p>`}
          ${description && `<p class='desc'>${description}</p>`}
        </button>
      </div>
      `
    }
    const arrowsTemplate = () => {
      return `<div class="arrows">
        <button class="arrow prev" data-arrow="-1">이전</button>
        <button class="arrow next" data-arrow="1">다음</button>
      </div>`
    }
    const indicatorsTemplate = () => {
      return `
      <div class="indicators">
        ${[...new Array(lastIndex + 1)].map((_, i) => `
          <div class='indicator${i === activeIndex ? ' active' : ''}'> 
            <button data-index="${i}">
              ${i}번째 View
            </button>
          </div>
        `).join('')}
      </div>`
    }
    const utilsTemplate = () => {
      return `<div class="area-utils">
        ${arrows !== false ? arrowsTemplate() : ''}
        ${indicators !== false ? indicatorsTemplate() : ''}
      </div>`
    }
    
    const dataListCloned = dataList.reduce((acc, data, i) => {
      const lastSlideIndex = dataList.length - 1
      const cloneData = {cloned: true}
      if(i === 0) acc.push({...dataList[lastSlideIndex], ...cloneData})
      acc.push(data)
      if(i === lastSlideIndex) acc.push({...dataList[0], ...cloneData})
      return acc
    }, [])
    const slidesData = type === 'center' ? dataListCloned : dataList
    
    carousel.innerHTML = `
      <div class="viewport">
        <div class="area-sliding">
          ${slidesData.map((data, i) => slideTemplate(data, i)).join('')}
        </div>
        ${(arrows !== false) && (indicators !== false) ? utilsTemplate() : ''}
      </div>
    `
    return carousel
  }
  mounted() {
    console.log('mounted')

    this.checkEndImageLoad()
    .then(() => this.setStateViewportWidth())
    .then(() => this.setStateSlideWidth())
    .then(() => this.setDomSlideWidth())

    this.resizeHandler(() => {
      this.setStateViewportWidth()
      .then(() => this.setStateSlideWidth())
      .then(() => this.setDomSlideWidth())
    })

    this.setEvent(this.$template, 'click', (e) => {
      this.nextActiveIndexByClickElem(e)
      .then(nextActiveIndex => this.setStateActiveIndex(nextActiveIndex))
      .then(() => this.setDomSliding())
      .then(() => this.setDomActive())
    })
  }
  resizeHandler(callback) {
    let checkResizeEnd
    window.addEventListener('resize', () => {
      clearTimeout(checkResizeEnd)
      checkResizeEnd = setTimeout(() => callback(), 100)
    })
  }

  async checkEndImageLoad() {
    const allImg = this.$template.querySelectorAll('.slide img')
    if(allImg.length < 1) return true
    const lastImg = allImg[allImg.length - 1]
    return checkLoad(lastImg)
  }
  async setStateViewportWidth() {
    const viewportWidth = this.$template.querySelector('.viewport').offsetWidth
    this.setState({viewportWidth})
  }
  setStateSlideWidth() {
    const {slideNumPerView} = this.$props
    const {viewportWidth} = this.$state
    const slideWidth = (viewportWidth / slideNumPerView).toFixed(2)
    console.log('setStateSlideWidth', slideWidth)
    this.setState({slideWidth})
  }
  async setStateActiveIndex(nextActiveIndex) {
    const {lastIndex, activeIndex} = this.$state
    if(activeIndex === nextActiveIndex) return false
    // const {twin} = this.$props
    const checkActiveIndex = nextActiveIndex < 0
      ? lastIndex
      : nextActiveIndex > lastIndex
        ? 0
        : nextActiveIndex

        console.log('setStateActiveIndex', activeIndex)
    this.setState({activeIndex: checkActiveIndex})
    // twin && twin.setState({activeIndex})
    // console.log('twinChcekc', this.$props, twin)
  }
  async nextActiveIndexByClickElem(e) {
    // if(e.target.tagName !== 'BUTTON') return false
    const {activeIndex} = this.$state
    const button = e.target.closest('button')
    if(!button) return Promise.reject('not a button')
    const dataAttr = button.dataset
    const nextActiveIndex = dataAttr.arrow
      ? activeIndex + dataAttr.arrow * 1
      : dataAttr.index 
        ? dataAttr.index * 1
        : Promise.reject(new Error('ERROR: click element data attribute - dataAttr: ', dataAttr))
    if(activeIndex === nextActiveIndex) return Promise.reject('same Index')
    return nextActiveIndex
  }
  setDomSlideWidth() {
    const {slideWidth} = this.$state
    const slides = this.$template.querySelectorAll('.slide')
    slides.forEach(slide => slide.style.width = `${slideWidth}px`)
  }
  setDomSliding() {
    console.log('setDomSliding')
    const {slideNumPerSliding} = this.$props
    const {activeIndex, slideWidth} = this.$state
    const slidingArea = this.$template.querySelector('.area-sliding')
    slidingArea.style.transform = `translateX(-${(slideWidth * slideNumPerSliding) * activeIndex}px)`
  }
  setDomActive() {
    const {activeIndex} = this.$state
    console.log('setdomactive', activeIndex)
    domSetActiveIndex(this.$template, '.slide:not(.cloned)', activeIndex)
    domSetActiveIndex(this.$template, '.indicator', activeIndex)
  }
}
