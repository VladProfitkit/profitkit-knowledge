$(function () {
    //откртыие и закрытие модалок:
	let modalTriggers = $('[data-modal]');
    if (modalTriggers.length) {
        modalTriggers.on('click', function () {
            let id = $(this).data('modal');

            if ($(id).length) {
                $(id).show();

                $(id).on('click', function(e) {
                    if ($(id).is(e.target))
                        $(this).hide();
                });

                $(id).find('[data-modal-close]').on('click', function() {
                    $(id).hide();
                });
            }
        });
    }

    //ввод своего варианта среди радио-кнопок:
    $('body').on('focus', '.pk-form__item-input--custom-radio-option', function() {
        let optionWrapper = $(this).closest('.pk-form__item-radio--custom'),
            radio = optionWrapper.find('input[type="radio"]');

        radio.prop('checked', true);
    });

    $('body').on('input', '.pk-form__item-input--custom-radio-option', function() {
        let optionWrapper = $(this).closest('.pk-form__item-radio--custom'),
            radio = optionWrapper.find('input[type="radio"]'),
            text = $(this).val();

        radio.val(text);
    });

    //загрузка и удаления файлов в формах:
    let aleadyUploadedFiles = null;

    function byteConverter(bytes, decimals, only) {
        const K_UNIT = 1024;
        const SIZES = ['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb'];

        if (bytes == 0) return '0 b';

        if (only === 'MB') return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + ' Mb' ;

        let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
        let resp = parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) + ' ' + SIZES[i];

        return resp;
    }

    function htmlFileData(name, size, index = false) {
        return '\n' +
            '<div class="pk-form__item-uploaded-file pk-uploaded-file">\n' +
            '    <span class="pk-uploaded-file__name">' + name + '</span>\n' +
            '    <span class="pk-uploaded-file___size">' + size + '</span>\n' +
            '    <button class="pk-uploaded-file__remove btn btn--remove" type="button"' + (index === false ? '' : ' data-index="' + index + '"') + '>\n' +
            '        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '            <path d="M18.5 6.5L6.5 18.5M6.5 6.5L18.5 18.5" stroke="#D2D2D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n' +
            '        </svg>\n' +
            '    </button>\n' +
            '</div>';
    }

    $('body').on('click', '.pk-form__item-file-label', function() {
        let container = $(this).closest('.pk-form__item-body--files'),
            input = container.find('.pk-form__item-file'),
            isMultiple = input.attr('multiple') == 'multiple';

        if (isMultiple) {
            aleadyUploadedFiles = input[0].files;
        }
    });

    $('body').on('change', '.pk-form__item-file', function() {
        let container = $(this).closest('.pk-form__item-body--files'),
            label = container.find('.pk-form__item-file-label'),
            listBlock = container.find('.pk-form__item-file-list'),
            isMultiple = $(this).attr('multiple') == 'multiple';

        if (isMultiple) {
            let previouslyUploadedfilesCount = aleadyUploadedFiles.length;

            if (previouslyUploadedfilesCount > 0) {
                listBlock.html('');

                let mergedList = new DataTransfer();

                for (let i = 0; i < aleadyUploadedFiles.length; i++) {
                    let file = aleadyUploadedFiles[i];

                    mergedList.items.add(file);
                }

                for (let i = 0; i < $(this)[0].files.length; i++) {
                    let file = $(this)[0].files[i];

                    mergedList.items.add(file);
                }

                $(this)[0].files = mergedList.files;
            }

            for (let i = 0; i < $(this)[0].files.length; i++) {
                let file = $(this)[0].files[i],
                    index = previouslyUploadedfilesCount > 0 ? ((previouslyUploadedfilesCount + i) - previouslyUploadedfilesCount) : (i - previouslyUploadedfilesCount),
                    name = file.name,
                    size = byteConverter(file.size, 1),
                    htmlData = htmlFileData(name, size, index);

                listBlock.append(htmlData);
            }

            //console.log($(this)[0].files);
        } else {
            let file = $(this)[0].files[0],
                name = file.name,
                size = byteConverter(file.size, 1),
                htmlData = htmlFileData(name, size);

            label.hide();
            listBlock.html(htmlData);
        }
    });

    $('body').on('click', '.pk-uploaded-file__remove', function() {
        let container = $(this).closest('.pk-form__item-body--files'),
            label = container.find('.pk-form__item-file-label'),
            listBlock = container.find('.pk-form__item-file-list'),
            fileInput = container.find('.pk-form__item-file'),
            isMultiple = fileInput.attr('multiple') == 'multiple';

        if (isMultiple) {
            let index = parseInt($(this).data('index')),
                clearedList = new DataTransfer();

            for (let i = 0; i < fileInput[0].files.length; i++) {
                if (i !== index) {
                    let file = fileInput[0].files[i];

                    clearedList.items.add(file);
                }
            }

            fileInput[0].files = clearedList.files;
            $(this).closest('.pk-uploaded-file').remove();

            if (listBlock.find('.pk-uploaded-file').length <= 0) {
                listBlock.html('');
            }

            //console.log(fileInput[0].files);
        } else {
            fileInput.val(null);
            listBlock.html('');
            label.show();
        }
    });

    //мультистрочное свойство в формах:
    $('body').on('click', '.pk-form__item-miltistring-add', function() {
        let addBtn = $(this),
            fieldName = addBtn.data('field-name'),
            htmlMarkup = '\n' +
                '<div class="pk-form__item-miltistring-text">\n' +
                '    <input class="pk-form__item-input pk-form__item-input--multistring" type="text" placeholder="placeholder" name="' + fieldName + '">\n' +
                '    <button class="pk-form__item-miltistring-remove btn btn--remove" type="button">\n' +
                '        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '            <path d="M18.5 6.5L6.5 18.5M6.5 6.5L18.5 18.5" stroke="#D2D2D2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n' +
                '        </svg>\n' +
                '    </button>\n' +
                '</div>';

        addBtn.before(htmlMarkup);
    });

    $('body').on('click', '.pk-form__item-miltistring-remove', function() {
        let multitextBlock = $(this).closest('.pk-form__item-miltistring-text');

        multitextBlock.remove();
    });

    //подсказки:
    $('body').on('click', '.pk-tip__trigger', function() {
        let tip = $(this).closest('.pk-tip');

        tip.toggleClass('pk-tip--open');
    });

    $('body').on('click', function(e) {
        if (!$('.pk-tip').is(e.target) && $('.pk-tip').has(e.target).length === 0) {
            if ($('.pk-tip--open').length) {
                $('.pk-tip--open').removeClass('pk-tip--open');
            }
        }
    });

    //кастомные селекты:
    let selectsDefault = $('select.pk-form__item-select');
    if (selectsDefault.length) {
        selectsDefault.each(function () {
            let customSelectDefault = new Choices($(this)[0], {
                searchEnabled: false,
                placeholder: true,
                placeholderValue: 'Выберите',
                classNames: {
                    containerOuter: ['choices', 'pk-choices'],
                    containerInner: ['choices__inner', 'pk-choices__inner'],
                    input: ['choices__input', 'pk-choices__input'],
                    inputCloned: ['choices__input--cloned', 'pk-choices__input--cloned'],
                    list: ['choices__list', 'pk-choices__list'],
                    listItems: ['choices__list--multiple', 'pk-choices__list--multiple'],
                    listSingle: ['choices__list--single', 'pk-choices__list--single'],
                    listDropdown: ['choices__list--dropdown', 'pk-choices__list--dropdown'],
                    item: ['choices__item', 'pk-choices__item'],
                    itemSelectable: ['choices__item--selectable', 'pk-choices__item--selectable'],
                    itemDisabled: ['choices__item--disabled', 'pk-choices__item--disabled'],
                    itemChoice: ['choices__item--choice', 'pk-choices__item--choice'],
                    description: ['choices__description', 'pk-choices__description'],
                    placeholder: ['choices__placeholder', 'pk-choices__placeholder'],
                    group: ['choices__group', 'pk-choices__group'],
                    groupHeading: ['choices__heading', 'pk-choices__heading'],
                    button: ['choices__button', 'pk-choices__button'],
                    notice: ['choices__notice', 'pk-choices__notice'],
                    addChoice: ['choices__item--selectable', 'pk-choices__item--selectable', 'add-choice'],
                },
            });
        });
    }

    let selectsSearch = $('select.pk-form__item-search-select');
    if (selectsSearch.length) {
        selectsSearch.each(function () {
            let customSelectSearch = new Choices($(this)[0], {
                placeholder: true,
                placeholderValue: 'Выберите',
                searchPlaceholderValue: 'Выберите',
                classNames: {
                    containerOuter: ['choices', 'pk-choices'],
                    containerInner: ['choices__inner', 'pk-choices__inner'],
                    input: ['choices__input', 'pk-choices__input', 'pk-form__item-input'],
                    inputCloned: ['choices__input--cloned', 'pk-choices__input--cloned'],
                    list: ['choices__list', 'pk-choices__list'],
                    listItems: ['choices__list--multiple', 'pk-choices__list--multiple'],
                    listSingle: ['choices__list--single', 'pk-choices__list--single'],
                    listDropdown: ['choices__list--dropdown', 'pk-choices__list--dropdown'],
                    item: ['choices__item', 'pk-choices__item'],
                    itemSelectable: ['choices__item--selectable', 'pk-choices__item--selectable'],
                    itemDisabled: ['choices__item--disabled', 'pk-choices__item--disabled'],
                    itemChoice: ['choices__item--choice', 'pk-choices__item--choice'],
                    description: ['choices__description', 'pk-choices__description'],
                    placeholder: ['choices__placeholder', 'pk-choices__placeholder'],
                    group: ['choices__group', 'pk-choices__group'],
                    groupHeading: ['choices__heading', 'pk-choices__heading'],
                    button: ['choices__button', 'pk-choices__button'],
                    notice: ['choices__notice', 'pk-choices__notice'],
                    addChoice: ['choices__item--selectable', 'pk-choices__item--selectable', 'add-choice'],
                },
                noResultsText: 'Ничего не найдено',
            });
        });
    }
});