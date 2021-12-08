
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

// Аккордеон в news-section
accNewsSection()
function accNewsSection() {
    const acc = find('.news-section__content-wrap')
    const accHeader = acc.querySelector('.acc-header')
    const accBody = acc.querySelector('.acc-body')
    const tabElems = accHeader.querySelectorAll('[data-tab-head]')
    const tabBodyElems = accBody.querySelectorAll('[data-tab-body]')

    for (let i = 0; i < tabElems.length; i++) {
        const tab = tabElems[i];
        
        tab.addEventListener('click', () => {
            const dataAttr = tab.dataset.tabHead
            const tabBody = accBody.querySelector(`[data-tab-body=${dataAttr}]`)

            removeAll(tabElems, '_active')
            tab.classList.add('_active')

            removeAll(tabBodyElems, '_active')
            tabBody.classList.add('_active')
        })
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