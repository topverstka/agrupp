
// Служебные переменные
const d = document;
const body = d.querySelector('body');

// Служебные функции

function find(selector) {
	return document.querySelector(selector)
}

function findAll(selectors) {
	return document.querySelectorAll(selectors)
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items,itemClass) {   
    if (typeof items == 'string') {
      items = document.querySelectorAll(items)
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      item.classList.remove(itemClass)
    }
}

function bodyLock(con) {
    if (con === true) {
        body.classList.add('_lock');
    } else if (con === false) {
        body.classList.remove('_lock');
    } else if (con === undefined) {
		if (!body.classList.contains('_lock')) {
			body.classList.add('_lock');
		}
		else {
			body.classList.remove('_lock')
		}
	} else {
		console.error('Неопределенный аргумент у функции bodyLock()')
	}
}

// Валидация формы
function validationForm() {
    const name = find('#user_name')
    const phone = find('#user_phone')
    const email = find('#user_email')

    let con = true

    for (let i = 0; i < [name, phone, email].length; i++) {
        const elem = [name, phone, email][i];
        const elemValue = elem.value.trim()

        if (elemValue === '') {
            elem.classList.add('_error')
            con = false
        } else {
            elem.classList.remove('_error')
            con = true
        }
    }

    return con
}

// Отправка формы
// sumbitForm()
function sumbitForm() {
    const form = find('.modal__form')

    form.addEventListener('submit', async e => {
        const modal = find('.modal._show')
        const btnSend = form.querySelector('[type=submit]')
        btnSend.classList.add('send-preloader')

        e.preventDefault()
        
        let con = validationForm()

        if (con === true) {
            const formData = new FormData()
            const action = form.getAttribute('action')
    
            let response = await fetch(action, {
                method: 'POST',
                body: formData
            })
            
            // settimeout здесь для того, чтобы показать работу отправки формы. В дальнейшем это нужно убрать
            setTimeout(() => {
                if (response.ok) {
                    console.log('Successful')
                    form.reset()
    
                    modal.classList.remove('_show')
                    find('#send-done').classList.add('_show')
                    btnSend.classList.remove('send-preloader')
                }
                else {
                    console.log('Error')
                    form.reset()
    
                    modal.classList.remove('_show')
                    find('#send-error').classList.add('_show')
                    btnSend.classList.remove('send-preloader')
                }
            }, 2000)

        }
    })
}

// Мобильное меню
// menu()
function menu() {
	const burger = find('.burger')
	const menu = find('.menu');
	
	// Высота меню
	window.addEventListener('resize', () => {
		const headerHeight = find('.header').clientHeight

		if (window.innerWidth <= 768) {
			menu.style.paddingTop = headerHeight + 'px'
		}
		else {
			menu.style.paddingTop = 0
		}
	})

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('burger_close')
		menu.classList.toggle('_show')
		bodyLock()
	})
}

const advantagesSlider = new Swiper('.main-slider__container', {
	spaceBetween: 0,
	loop: true,

	navigation: {
		nextEl: '.main-slider__arrow-next',
		prevEl: '.main-slider__arrow-prev',
	},

    pagination: {
        el: '.main-slider__pagination',
    },
});

// Табы в news-section
if (find('.acc')) tabsComponents()
function tabsComponents() {
    const acc = find('.acc')
    const accHeader = acc.querySelector('.acc-header')
    const accBody = acc.querySelector('.acc-body')
    const tabElems = accHeader.querySelectorAll('[data-tab-head]')
    const totalTabItemElems = accBody.querySelectorAll('[data-tab-item]')

    for (let i = 0; i < tabElems.length; i++) {
        const tab = tabElems[i];
        
        tab.addEventListener('click', () => {
            const dataAttr = tab.dataset.tabHead
            const tabItemElems = (dataAttr === 'all') ? accBody.querySelectorAll(`[data-tab-item]`) : accBody.querySelectorAll(`[data-tab-item="${dataAttr}"]`)

            removeAll(totalTabItemElems, '_show')

            removeAll(tabElems, '_active')
            tab.classList.add('_active')

            for (let i = 0; i < tabItemElems.length; i++) {
                const tabItem = tabItemElems[i];
                    
                tabItem.classList.add('_show')

                if (tabItem.classList.contains('employee-card_best')) {
                    const numCards = tabItemElems.length - 3

                    if (i >= numCards) {
                        tabItem.classList.add('_popup-top')
                    }
                }
            }
        })
    }
}

// Позиционирование карточек в контейнере списка карточек faq
// cardFAQ()
// function cardFAQ() {
//     const container = find('.faq-section__list')
//     const cardElems = findAll('.faq-section__card')
//     let countColumn = 2 // кол-во колонок
//     const gapColumn = 20 // отступ между колонками
//     const gapRow = 10 // отступ между строками
//     const countCard = cardElems.length // кол-во карточек

//     if (window.innerWidth < 768) countColumn = 1
//     console.log(window.innerWidth)
//     window.addEventListener('resize', e => {
//         if (window.innerWidth < 768) countColumn = 1
//         widthCardFAQ()
//         positionCardFAQ()
//     })

//     widthCardFAQ()
//     function widthCardFAQ() {
//         // Ширина карточек
//         const containerWidth = container.offsetWidth
//         const cardWidth = containerWidth / countColumn - gapColumn / 2

//         for (let i = 0; i < cardElems.length; i++) {
//             const card = cardElems[i];
//             card.style.width = cardWidth + 'px'
//         }
//     }

    // positionCardFAQ()
    // function positionCardFAQ() {
    //     // console.log('ok')
    //     // Позиционирование карточек
    //     let r = 0 // номер строки, начиная с нуля
    
    //     for (let i = 0; i < cardElems.length; i++) {
    //         const card = cardElems[i];
    //         const cardHeight = card.offsetHeight
    //         const cardTop = (i === 0 || i === 1) ? 0 : cardHeight + gapRow // Если итерируется первая или вторая карточка, то для них значение top = 0, у остальных cardTop равен высоте одной карточки умноженной на оступ между ними. Далее это значение будет увеличиваться в n-раз в зависимости от того, какая сейчас строка
    
    //         // Если это первая строка
    //         if (r === 0) {
    //             card.style.top = cardTop + 'px'
    //         }
    //         // В остальных случаях
    //         else {
    //             card.style.top = cardTop * r + 'px'
    //         }
            
    //         // При итерации каждой второй карточки
    //         if ((i+1)%2 === 0) {
    //             card.style.right = 0 
    //             r++ // увеличивается номер строки на 1
    //         }
    //     }
    // }

    // Размер списка с карточками с частозадаваемыми вопросами
    // container.style.height = countCard / countColumn + 'px'
// }

// Размер списка с карточками с частозадаваемыми вопросами
// sizeContainerFAQ()
// function sizeContainerFAQ() {
//     const container = find('.faq-section__list')
//     const cardElems = findAll('.faq-section__card')


// }

// positionCardFAQ()
// function positionCardFAQ() {
//     const container = find('.faq-section__list')
//     const cardElems = findAll('.faq-section__card')
//     const countColumn = 1 // кол-во колонок
//     const gapColumn = 20 // отступ между колонками
//     const gapRow = 10 // отступ между строками

//     // Ширина карточек
//     const containerWidth = container.offsetWidth
//     const cardWidth = containerWidth / countColumn - gapColumn / 2

//     for (let i = 0; i < cardElems.length; i++) {
//         const card = cardElems[i];
//         card.style.width = cardWidth + 'px'
//     }

//     // Позиционирование карточек
//     let r = 0 // номер строки, начиная с нуля
//     let n = 0 // номер карточки в каждой строке. Равно нулю при переходе на другую строку

//     for (let i = 0; i < cardElems.length; i++) {
//         const card = cardElems[i];
//         const cardHeight = card.offsetHeight
//         const cardTop = (i+1 <= countColumn) ? 0 : cardHeight + gapRow // Если итерируется первая или вторая карточка, то для них значение top = 0, у остальных cardTop равен высоте одной карточки умноженной на оступ между ними. Далее это значение будет увеличиваться в n-раз в зависимости от того, какая сейчас строка
//         // console.log(i+1, countColumn)
//         // Если это первая строка
//         if (r === 0) {
//             card.style.top = cardTop + 'px'
//             // console.log(card)
//         }
//         // В остальных случаях
//         else {
//             card.style.top = cardTop * r + 'px'
//         }
//         // console.log(324*0)
//         // console.log(n)
//         card.style.left = (cardWidth * n) + ((countColumn - 1) * n * gapColumn / 2) + 'px'
//         // if ((i+1)%(n+1+r) === 0) {
//         //     console.log((cardWidth * n) + ((countColumn - 1) * n) + 'px', card, i, n, r)
//         // }

//         n++
        
//         // При итерации последней карточки в каждой строке
//         if ((i+1)%countColumn === 0) {
//             // card.style.left = cardWidth + 
//             r++ // увеличивается номер строки на 1
//             n = 0 // обнуляем номер карточки
//         }
//     }
// }

// аккордеоны в faq
// accFAQ()
// function accFAQ() {
//     const accElems = findAll('.acc')
//     // console.log('acc')

//     for (let i = 0; i < accElems.length; i++) {
//         const acc = accElems[i];
        
//         const accHeader = acc.querySelector('.acc-header')
//         const accBody = acc.querySelector('.acc-body')
//         const parent = acc
    
//         // console.log(accBody.offsetHeight, accBody.clientHeight, accBody.scrollHeight)
//         // const box = find('#box')
//         // console.log(box.scrollHeight)

//         accHeader.addEventListener('click', e => {
            
//             parent.classList.toggle('_show')
//             if (parent.classList.contains('_show')) {
//                 accBody.style.maxHeight = accBody.scrollHeight + 'px'
                
//             }
//             else {
//                 accBody.style.maxHeight = '0px'
//             }

//             if (parent.closest('.acc')) {
//                 const closestAcc = parent.closest('.acc')
//                 const closestAccBody = closestAcc.querySelector('.acc-body')
//                 closestAccBody.style.maxHeight = closestAccBody.scrollHeight + 'px'
//                 console.log(parent.closest('.acc'))

//             }
//         })
//     }
// }

accFAQ()
function accFAQ() {
    const accElems = document.querySelectorAll('.acc-header')

    for (let i = 0; i < accElems.length; i++) {
        
        accElems[i].addEventListener("click", function() {
            this.parentElement.classList.toggle("_show");
            var parent = this.parentElement.parentElement;
            var panel = this.nextElementSibling;

            if (panel.style.maxHeight){
                console.log('if')
                panel.style.maxHeight = null;
            } 
            else {
                panel.style.maxHeight = panel.scrollHeight + 25 + "px";
                parent.style.maxHeight = parseInt(parent.style.maxHeight) + 25 + panel.scrollHeight + "px";
            } 
        });
    }
}


// Функции для модальных окон
// modal()
function modal() {
    // Открытие модального окна, если в url указан его id
    openModalHash()
    function openModalHash() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1)
            const modal = document.querySelector(`.modal#${hash}`)
    
            if (modal) {
                modal.classList.add('_show');
                bodyLock(true)
                closeWhenClickingOnBg(`#${hash} .modal__content`, modal);
            }
        }
    }
    
    // Закрытие модальных окон при клике по крестику
    closeModalWhenClickingOnCross()
    function closeModalWhenClickingOnCross() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];
            const closeThisModal = modal.querySelector('.modal__close')
    
            closeThisModal.addEventListener('click', () => {
                modal.classList.remove('_show')
                bodyLock(false)
                resetHash()
            })
        }
    }
    
    // Закрытие модальных окон при нажатии по клавише ESC
    closeModalWhenClickingOnESC()
    function closeModalWhenClickingOnESC() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];
    
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    modal.classList.remove('_show')
                    bodyLock(false)
                    resetHash()
                }
            })
        }
    }
    
    // Сброс id модального окна в url
    function resetHash() {
        const windowTop = window.pageYOffset
        window.location.hash = ''
        window.scrollTo(0, windowTop)
    }
    
    // Открытие модальных окон
    openModal()
    function openModal() {
        const btnsOpenModal = document.querySelectorAll('[data-modal-open]');
    
        for (let i = 0; i < btnsOpenModal.length; i++) {
            const btn = btnsOpenModal[i];
    
            btn.addEventListener('click', (e) => {
                const dataBtn = btn.dataset.modalOpen;
                const modalThatOpens = document.querySelector(`#${dataBtn}`)
    
                btn.classList.add('modal-show');
                modalThatOpens.classList.add('_show');
                bodyLock(true)
                closeWhenClickingOnBg(`#${dataBtn} .modal__content`, modalThatOpens);
                window.location.hash = dataBtn
            });
        }
    }
    
    // Закрытие модального окна при клике по заднему фону
    function closeWhenClickingOnBg(itemArray, itemParent, classShow = '_show') {
        document.addEventListener('click', (e) => {
            let itemElems = document.querySelectorAll(itemArray)
    
            for (let i = 0; i < itemElems.length; i++) {
                const item = itemElems[i];
    
                const target = e.target,
                    itsItem = target == item || item.contains(target),
                    itemIsShow = item.classList.contains(classShow);
    
                if (itemParent) {
                    const itsItemParent = target == itemParent || itemParent.contains(target),
                        itemParentIsShow = itemParent.classList.contains(classShow);
    
                    if (!itsItem && itsItemParent && itemParentIsShow) {
                        itemParent.classList.remove(classShow);
    
                        if (body.classList.contains('_lock')) {
                            bodyLock(false)
                        }
    
                        if (window.location.hash === '#' + itemParent.getAttribute('id')) {
                            resetHash()
                        }
                    }
                } else {
                    if (!itsItem && itemIsShow) {
                        item.classList.remove(classShow);
                        if (body.classList.contains('_lock')) {
                            bodyLock(false)
                        }
    
                        if (window.location.hash === '#' + itemParent.getAttribute('id')) {
                            resetHash()
                        }
                    }
                }
    
            }
        })
    }
}

