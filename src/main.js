import './scss/main.scss'
import 'swiper/css';

import Swiper, { Navigation, Pagination, Scrollbar, Controller } from 'swiper';
import axios from 'axios';

(function() {
    "use strict";
    var selectors = {
        self:      '#app',
    };

    function CmpModal(config) {
        function init() {
            makePage('http://localhost:4000/posts1');
            makePage('http://localhost:4000/posts2');
            
            /* document.querySelectorAll('.pdp-inside__img--innerbox') && document.querySelectorAll('.pdp-inside__img--innerbox').forEach((el, idx) => {
                if (!el.dataset.modalInfo) return;
                const data = Object.values(JSON.parse(el.dataset.modalInfo))[0];
                makeSwiperModal({target: el, btn: '.btn-modal__scoped', data, type: 'no-slide'});
            }); */

        }
        if (config && config.element) {
            init();
        }
    }
    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new CmpModal({ element: elements[i] });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector("body");
        var observer         = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new CmpModal({ element: element });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
}());

function makePage(url) {
    try {
        axios.get(url)
        .then(res => {
            return res.data
        })
        .then(res => {
            return makeContent(res);
        })
        .then(res => {
            const _cls = `.${Array.prototype.join.call(res.classList, '.')}`;
            const target = res;
            const data = Object.values(JSON.parse(target.dataset.modalInfo))[0];
            makeSwiperModal({target, btn: '.btn-modal__scoped', data});
        })
    } catch (error) {
        console.error(error);
    }
}

function makeContent(data) {
    const _data = data;
    const _swiper = document.createElement('div');
    _swiper.dataset.modalInfo = JSON.stringify({"modal": _data.map(data => data.modal)});
    _swiper.className = 'wrap_swiper_cont';
    const _template = (text, data) => `
        <div class="swiper-wrapper">
            ${
                data.reduce((acc, data) => {
                    return acc += 
                    `
                    <div class="swiper-slide">
                        <div class="slide-img">
                            <a href="#" class="btn-modal__scoped">
                                <img src="${data.img}" class="small" alt="${data.tit}">
                            </a>
                        </div>
                        <div class="meta-info">
                            <h4>${data.tit}</h4> 
                            <p>${data.description}</p>
                        </div>
                    </div>
                    `
                }, '')
            }
        </div>
    `;
    _swiper.innerHTML = _template`${_data}`;
    document.getElementById('app').append(_swiper);
    return _swiper;
}

const makeSwiper = (cls) => {
    return new Swiper(cls, {
        modules: [Navigation, Pagination, Scrollbar, Controller],
        slidesPerView: 1,
        loop: true,
        threshold: 10,
        pagination: {
            el: `${cls} .swiper-pagination`,
            type: 'bullets',
            clickable: true,
            renderBullet:function(index, className){
                return'<button type="button" class="'+ className +'"><span class="ir-text">' + (index + 1) + '번 슬라이드 </span></button>';
            },        
        }, 
        breakpoints:{
            768: {
                slidesPerView: 3,  
                spaceBetween: 24,
                centeredSlides: true,
                threshold: 100,
            }
        }
    });
}
export function makeSwiperModal(params) {
    const _base = params.target;
    const _initial = {
        data: params.data,
        type: params.type,
        triggers: _base.querySelectorAll(params.btn),
        ranNum: `swiper_${Math.floor(Math.random() * 10000000)}`,
        modalData: [],
        close: _base.querySelectorAll( '.btn-modal-close' ),
        modals: _base.querySelectorAll( '.layer-popup__container--dimbg' ),
        modalInners: _base.querySelectorAll( '.modal-inner' ),
        isModal: false,
        isSlide: false,
        modal: '',
        modalWrap: '',
        modalSwiper: '',
        parentEle: '',
        swiper: '',
    };
    const init = () => {
        _base.classList.add(_initial.ranNum);
        const _cls = `.${Array.prototype.join.call(_base.classList, '.')}`;
        _initial.swiper = makeSwiper(_cls);
        _initial.triggers = _base.querySelectorAll(params.btn);
        _initial.triggers.forEach((trigger, idx) => {
            trigger.addEventListener( 'click', () => {
                setModalData({el: _base, data: _initial.data, id: _initial.ranNum})
                    .then(res => {
                        const _idx = trigger.closest('.swiper-slide') ? trigger.closest('.swiper-slide').dataset.swiperSlideIndex : idx;
                        // 데이터 없는 경우
                        if (_initial.data[_idx].error) {
                            alert(_initial.data[_idx].error);
                            return;
                        }
                        if (!_initial.isModal && !_initial.isSlide) {
                            trigger.classList.add('modal-open');
                            _initial.isModal = true;
                            !_initial.type && slideAndModal(trigger);
                            _initial.type && openSwiperModal({btn: trigger, idx: _idx});
                        }
                    });
            });
        });
        // 좌우 슬라이드 이동 후 모달 창 열기
        _initial.swiper && _initial.swiper.on('transitionEnd', () => {
            if (!_initial.isModal && !_initial.isSlide) return;
            setTimeout(() => {
                openSwiperModal({idx: _initial.parentEle.dataset.swiperSlideIndex});
            }, 50);
        });
    };
    // 스와이퍼 슬라이드 및 모달창 열기
    const slideAndModal = (btn) => {
        if (!_initial.isModal && _initial.isSlide) return;
        _initial.isSlide = true;

        _initial.parentEle = btn.closest('.swiper-slide'); // 클릭 엘리먼트 부모 swiper-slide 찾기
        if (_initial.parentEle.classList.contains('swiper-slide-prev')) {
            _initial.swiper.slidePrev();
        } else if (_initial.parentEle.classList.contains('swiper-slide-next')) {
            _initial.swiper.slideNext();
        } else {
            openSwiperModal({btn, idx: _initial.parentEle.dataset.swiperSlideIndex}); // 활성화 엘리먼트 클릭 모달창 열기
        }
    };
    // 태그드 템플릿
    const template = (str, tag) => {
        const _template = `
            <div class="layer-popup__container--dimbg pdp-brand__popview">
                <!-- pdp-brand__popview -->
                <div class="layer-popup__wrap modal-inner type-basic">
                    <div class="layer-popup__innerbox">
                        <div class="layer-popup__contents">
                            <!-- [ Component Swiper ] : popup 1 View Type, pdp-brand__popview Case  -->
                            <div class="swiper popview-swiper" data-cmp-is="pdp-main-slide">
                                <div class="swiper-wrapper">
                                    ${tag}
                                </div>
                                <!-- pc에서 오버시 노출-->
                                <button class="swiper-button-prev hover-prev"><span class="ir-text">이전</span></button>
                                <button class="swiper-button-next hover-next"><span class="ir-text">다음</span></button>
                                <!-- //pc에서 오버시 노출-->
                                <div class="layer-popup__btns">
                                    <div class="swiper-pagination"></div>
                                    <button class="swiper-button-prev"><span class="ir-text">이전</span></button>
                                    <button class="swiper-button-next"><span class="ir-text">다음</span></button>
                                </div>
                            </div>
                            <!-- // [ Component Swiper ] : popup 1 View Type, pdp-brand__popview Case  -->
                        </div>
                    </div>
                    <button type="button" class="btn-close__layerModal btn-modal-close"><span class="ir-text">닫기</span></button>
                </div>
            </div>
        `;
        return _template;
    };
    // 모달 만들기
    const setModalData = async (params) => {
        const {el, data, id} = params;
        if (!data || document.querySelector(`.${id}.cmp-modal`)) return;
        let _tag = '';
        data.forEach(data => {
            if (data.type === 'video') {
                _tag += `
                <div class="swiper-slide">
                    <!-- mp4 CASE -->
                    <div class="layer-content__fullsize is-video">
                        <button type="button" class="btn-play-video">
                            <img src="${data.thumb}" class="thumb" alt="썸네일">
                            <p class="layer-popup__alert-txt">※ 본 사진과 설명은 참고용으로 실제와 다를 수 있습니다.</p>
                            <span class="ir-text">동영상 재생</span>
                        </button>
                        <video class="video" muted controls> 
                            <source src="${data.link}" type="video/mp4">                                                                                                                                                    
                        </video>
                    </div>
                    <div class="caption__warp cmp-toggle__wrap">
                        <button class="btn-caption btn-toggle" data-toggle="show" data-truetext="자막 보기" data-falsetext="자막 닫기">자막 보기</button>
                        <div class="caption__box cmp-toggle__box">
                            <p>${data.script}</p>
                        </div>
                    </div>
                    <div class="layer-content__box">
                        <div class="layer-content__tit">
                            <h2 class="tit-txt">${data.tit}</h2>
                        </div>
                        <div class="layer-content__text">
                            <p class="text-desc">${data.script}</p>
                        </div>
                    </div>
                </div>
                `;
            } else if (data.type === 'youtube') {
                _tag += `
                <div class="swiper-slide">
                    <!-- youtube CASE -->
                    <div class="layer-content__fullsize is-video">
                        <button type="button" class="btn-play-video">
                            <img src="${data.thumb}" class="thumb" alt="썸네일">
                            <p class="layer-popup__alert-txt">※ 본 사진과 설명은 참고용으로 실제와 다를 수 있습니다.</p>
                            <span class="ir-text">유튜브 재생</span>
                        </button>
                        <iframe class="youtube" src="${data.link}&autoplay=false&version=3&mute=0&loop=1&playerapiid=ytplayer&modestbranding=1&showinfo=0?ecver=2" title="${data.tit}" autoplay="1" rel="0" allow="autoplay" frameborder="0" allowfullscreen="" ></iframe>
                    </div>
                    <div class="layer-content__box">
                        <div class="layer-content__tit">
                            <h2 class="tit-txt">${data.tit}</h2>
                        </div>
                        <div class="layer-content__text">
                            <p class="text-desc">${data.script}</p>
                        </div>
                    </div>
                </div>
                `;
            } else if (data.type === 'image') {
                const _moImg = data.moLink ? `<img src="${data.moLink}" class="type-mo" alt="${data.alt}" />` : '';
                const _pcImg = data.pcLink ? `<img src="${data.pcLink}" class="type-pc" alt="${data.alt}" />` : '';
                _tag += `
                <div class="swiper-slide">
                    <div class="layer-content__fullsize">
                        ${_moImg}
                        ${_pcImg}
                        <p class="layer-popup__alert-txt">※ 본 사진과 설명은 참고용으로 실제와 다를 수 있습니다.</p>
                    </div>
                    <div class="layer-content__box">
                        <div class="layer-content__tit">
                            <h2 class="tit-txt">${data.tit}</h2>
                        </div>
                        <div class="layer-content__text">
                            <p class="text-desc">
                                ${data.script}
                            </p>
                        </div>    
                    </div> 
                </div>
                `;
            }
        });
        _initial.modal = document.createElement('div');
        _initial.modal.className = `cmp-modal aem-Grid aem-Grid--12 aem-Grid--default--12 ${_initial.ranNum}`;
        _initial.modal.innerHTML = template`${_tag}`;
        await document.body.append(_initial.modal);
        _initial.modalWrap = _initial.modal.querySelector('.layer-popup__container--dimbg');
        _initial.modalSwiper = setSwipe(`.${_initial.ranNum} .swiper.popview-swiper`, 0, videoStop); //모달 스와이퍼
        _initial.modal.querySelector('.btn-toggle') && toggleHandler(_initial.modal.querySelectorAll('.btn-toggle'));
        return _initial.modal;
        // setToggle(_initial.modal);
        // setVideo(_initial.modal);
    };
    //모달 열기
    const openSwiperModal = (params) => {
        const {btn, idx} = params;
        if (_initial.isModal && _initial.isSlide || _initial.type) {
            openThisModal(_initial.modalWrap, btn);
            _initial.modalSwiper.activeIndex !== parseInt(idx) && setTimeout(() => {
                _initial.modalSwiper.slideTo(parseInt(idx), 0, false); //모달 스와이퍼 슬라이드
            }, 100);
            _initial.isModal = _initial.isSlide = false;
            _initial.modalWrap.querySelector('.btn-modal-close').addEventListener('click', closeModal)
        }
    };
    // 모달창 열기
    const openThisModal = (target, btn) => {
        btn && btn.classList.add('modal-open');
        target.classList.add('show');
        document.body.classList.add('modal-open');
        target.setAttribute('tabindex', 0);
        tabEvent(target);
    };
    // 모달 닫기
    const closeModal = () => {
        const videos = _initial.modalWrap.querySelectorAll('video');
        const videoButtons = _initial.modalWrap.querySelectorAll('.btn-play-video.is-pause');
        _initial.modalWrap.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-open') && document.querySelector('.modal-open').classList.remove('modal-open');
        
        videoButtons && videoButtons.forEach((btn, idx) => {
            videos[idx].pause();
            btn.classList.remove('is-pause');
        })
        
        const _youtubePlayer = _initial.modalWrap.getElementsByTagName('iframe')[0]; // eslint-disable-line no-unused-vars
        if(_youtubePlayer) {
            const _youtubePlayerWindow =  _initial.modalWrap.getElementsByTagName('iframe')[0].contentWindow;
            _youtubePlayerWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');            
        }
    };
    //video
    const setVideo = (el) => {
        const _videoButtons = el.querySelectorAll('.is-video');
        const _videos = el.getElementsByTagName('video');
        if (_videos.length > 0) {
            Array.from(_videos).forEach(video => {
                video.load();
            });            
        }
        /* if (_videoButtons.length > 0) {
            Array.from(_videoButtons).forEach(videoButton => {
                videoButton.addEventListener('click', videoControll);
            });
        } */
    };
    // video 제어
    const videoControll = (e) => {
        if(e.target.classList.contains('btn-play-video')){
            const _thisVideo = e.target.nextElementSibling;
            const _thisYoutube = _thisVideo.classList.contains('youtube'); 
            if (_thisYoutube) {
                let youtubeplayer = _thisVideo.contentWindow; 
                
                if (e.target.classList.contains('is-pause')) {
                    youtubeplayer.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
                } else {
                    youtubeplayer.postMessage('{"event":"command","func":"playVideo","args":""}','*');
                }
            }else {
                if (_thisVideo.paused) {
                    _thisVideo.play();   // play() ➡ 영상 재생하는 메서드
                } else {
                    _thisVideo.pause();  // pause() ➡ 영상 중지하는 메서드
                }     
            }
            e.target.classList.toggle('is-pause');   
        }                              
    };   
    // All Video Stop
    const videoStop = () => {
        const _videos = _initial.modal.querySelectorAll('.is-video'); 
        const _videoPlayer = _initial.modal.querySelectorAll('.popview-swiper video');
        const _youtubeplayer = _initial.modal.querySelectorAll('.popview-swiper iframe');

        if (_videos) {
            Array.from(_videos).forEach(video => {
                const _button = video.querySelector('button');
                _button && _button.classList.remove('is-pause');
            });
        }

        if(_videoPlayer) {
            Array.from(_videoPlayer).forEach(videoPlayer => {
                videoPlayer && videoPlayer.pause();
            });
        }

        if(_youtubeplayer) {
            Array.from(_youtubeplayer).forEach(function(youtubeplayer) {
                let youtubeplayer2 = youtubeplayer.contentWindow; 
                youtubeplayer2.postMessage('{"event":"command","func":"stopVideo","args":""}','*');
            });   
        }
    };
    // 모달창 만들기
    const setSwipe = (target, first, func) => {
        return new Swiper(target, {
            modules: [Navigation, Pagination, Scrollbar, Controller],
            initialSlide : first ? first : 0,
            threshold: 50,
            slidesPerView: 1,
            on: {
                transitionStart: () => {
                    func && func();
                }
            },
            pagination: {
                el: `${target} .swiper-pagination`,
                type: "fraction",
                clickable: true,
                renderBullet:function(index, className){
                    return'<button type="button" class="'+ className +'"><span class="ir-text">' + (index + 1) + '번 슬라이드 </span></button>';
                },         
            },
            navigation: {
                nextEl: `${target} .swiper-button-next`,
                prevEl: `${target} .swiper-button-prev`,
            },
        });
    }
    init();
}

// 접근성 탭이동
function tabEvent(el) {
    let _idx = 0;
    el.setAttribute('tabIndex', '0');
    const _element = setTabElement(el);
    _element[0].focus();
    const tabMove = (event) => {
        if (event.keyCode === 9 && document.body.classList.contains('modal-open')) {
            event.preventDefault();
            _element[_idx].focus();
            _idx = (_idx + 1) % _element.length;
        } else {
            document.removeEventListener('keydown',tabMove);
        }
    };
    document.addEventListener('keydown', tabMove);
}

// 포커스 엘리먼트 선택
function setTabElement(el) {
    const _tagName = ['a', 'button', 'input', '[tabIndex]'];
    let _arr = [];
    _tagName.forEach(items => {
        el.querySelectorAll(items) && Array.from(el.querySelectorAll(items)).forEach(item => {
            if (item.tagName.toLowerCase() === 'input' && item.getAttribute('type') === 'hidden') {
                return;
            }
            _arr.push(item);
        });
    });
    return _arr;
}

function toggleHandler(triggers) {
    triggers && triggers.forEach( el => {
        if (el.classList.contains('is-set-toggle')) return;
        el.classList.add('is-set-toggle');
        el.addEventListener( 'click', openToggleBox, false );
    });
}

function openToggleBox(el) {
    const _toggles = el.currentTarget.dataset.toggle;
    const _trueText = el.currentTarget.dataset.truetext;
    const _falseText = el.currentTarget.dataset.falsetext;
    const _target = el.currentTarget.parentNode;
    if (_target.classList.contains('cmp-toggle__wrap')) {
        if (_target.classList.contains(_toggles)) {
            _target.classList.remove(_toggles);
            if(_trueText) {
                el.currentTarget.innerText = _trueText;
            }
        } else {
            _target.classList.add(_toggles);
            if(_falseText) {
                el.currentTarget.innerText = _falseText;
            }
        }
    }
}
