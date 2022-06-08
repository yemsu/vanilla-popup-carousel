import Component from '@/core/Component'
import Carousel from '@/components/Carousel'
import Modal from '@/components/Modal'
import { newElement } from '@/utils'
import '@/scss/components/TwinCarouselModal.scss'

export default class TwinCarouselModal extends Component {
  setup() {

  }
  template() {
    const TwinCarouselModal = newElement('div', 'carousel-twin-modal')
    return TwinCarouselModal
  }
  async mounted() {
    const {dataList} = this.$props
    const targetCarouselPosts1 = newElement('div', 'carousel-main')
    this.$target.appendChild(targetCarouselPosts1)
    const carouselMain = await new Carousel(targetCarouselPosts1, {
      dataList,
      type: 'center',
      slideNumPerView: 3
    })
    

    const targetPostModal = newElement('div', 'modal-carousel')
    this.$target.appendChild(targetPostModal)
    console.log('ELELEL', carouselMain.$target.querySelectorAll('.slide > button'))
    const modal = await new Modal(targetPostModal, {
      openButtons: carouselMain.$target.querySelectorAll('.slide > button')
    })
    
    const setupModalCarouselData = (dataHasModal) => {
      return dataHasModal.map(({ modal }) => ({
        tit: modal.tit,
        img: modal.pcLink,
        alt: modal.alt,
        description: modal.script,
      }))
    }
    const carouselSub = new Carousel(modal.$contentsArea, {
      dataList: setupModalCarouselData(dataList),
    })
    carouselMain.$props.twin = carouselSub
    carouselSub.$props.twin = carouselMain
    this.setState({
      carouselMain,
      carouselSub,
      modal
    })
  }
}