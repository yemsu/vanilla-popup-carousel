import Carousel from "@/components/Carousel";
import Popup from "@/components/Popup";
import { getPosts1 } from '@/utils/Http'

class App {
  constructor($target) {
    this.$target = $target
    this.dataPosts1 = null
    this.setup()
  }
  async setup() {
    await this.created()
    this.mounted()
  }
  async created() {
    await getPosts1().then(({ data }) => this.dataPosts1 = data)
    // console.log('created', this.dataPosts1)
  }
  mounted() {
    const setupModalCarouselData = (dataHasModal) => {
      return dataHasModal.map(({ modal }) => ({
        tit: modal.tit,
        img: modal.pcLink,
        alt: modal.alt,
        description: modal.script,
      }))
    }

    const carouselPosts1 = new Carousel(this.$target, {
      dataList: this.dataPosts1,
      type: 'center',
      slideNumPerView: 3
    })
    const postModal = new Popup(this.$target)
    const carouselPosts1Modal = new Carousel(postModal.$el.contentsArea, {
      dataList: setupModalCarouselData(this.dataPosts1),
    })
  }
}

export default App
