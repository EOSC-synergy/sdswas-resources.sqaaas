(function() {
    'use strict';

    var requirejsOptions = {
        baseUrl: '++theme++sdswas/',
        optimize: 'none',
        urlArgs:  "bust=v2",
        paths: {
            'main': 'js/main'
        }
    };

    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = requirejsOptions;
    }
    if (typeof requirejs !== 'undefined' && requirejs.config) {
        requirejs.config(requirejsOptions);
    }

    requirejs([
        'main',
    ], function($, _bootstrap) {
        (function($) {
            // Dentro de esta función $() seguirá funcionando como alias de jQuery() pero no como alias para otras bibliotecas
            var Resources = {

                init: function() {
                    App.con("----> Resources init");
                    App.loader.init();
                    ModalWindow.init(); // Initialize if page has modal window.
                    this.filterMenu.init();
                },

                cards: {
                    withEmbeddedDocs: $(".resources-card.card-with-embedded-doc"),
                    withoutEmbeddedDocs: $(".resources-card:not(.card-with-embedded-doc)"),
                    withTriggers: $(".js-card-trigger"),
                    triggers: $(".js-card-trigger"),
                    titles: $(".resources-card-title :first-child"),
                    titleLenght: 70,

                    init: function() {
                        App.con("----> Resources cards init");
                        this.trimTextsLength();
                        this.addListeners();

                        //Remove this line
                        gsap.to(".page-overlay", {
                            duration: 5,
                            onComplete: function() {
                                App.loader.end();
                            }
                        });
                    },

                    trimTextsLength: function() {
                        // Trim titles
                        $(".resources-card-title :first-child").each(function() {
                            var text = $(this).text();
                            var maxlength = Resources.cards.titleLenght;
                            $(this).text(Utils.textTrimmer(text, maxlength));
                            if(text.length > maxlength) $(this).attr("title", text);
                        });
                    },

                    addListeners: function() {
                        App.con("----)))) Resources >> Cards are listening");

                        $(window).on("click", function() {
                            Header.hideSubmenus();
                            Resources.filterMenu.hideSubmenu();
                        });

                        this.attachOpenItemView();

                        $(window).on("resize", function() {
                            App.winW = $(window).width();
                            App.winH = $(window).height();
                            Sidenav.repos();
                            Header.hideSubmenus();
                            Resources.filterMenu.hideSubmenu();
                            Resources.cards.attachOpenItemView();
                        });
                    },

                    attachOpenItemView: function(){
                        //Attachs to the on click event of children elements with class "js-card-trigger"
                        //the function that opens modal window. The click is unattached in screens < 592px
                        //for cards whose modal window displays an embedded doc

                        //For cards whose modal window DOES NOT DISPLAY an embedded doc, always attach the function
                        $(".resources-card:not(.card-with-embedded-doc)").each(function () {
                            $(this).off("click",".js-card-trigger").on("click",".js-card-trigger", function(event) {
                                event.preventDefault();
                                //this is the current trigger but we use the parent who set the event because it has the data to be used by its children
                                Resources.populateModal(event.delegateTarget);
                            });
                        });

                        //For cards whose modal window DISPLAYS an embedded doc, unattach the function if screen < 592px
                        if (App.winW <= 592) {
                            Resources.cards.patchCardsWithEmbeddedDocs();
                        } else {
                            Resources.cards.restoreCardsWithEmbededDocs();
                        }
                    },

                    patchCardsWithEmbeddedDocs: function () {
                        App.con("Patching cards with embedded docs");
                        $(".card-with-embedded-doc").each(function () {
                            $(this).find(".js-card-trigger").css("cursor", "default")
                            $(this).off("click", ".js-card-trigger");
                        });
                    },
                    restoreCardsWithEmbededDocs: function () {
                        App.con("Restoring cards with embedded docs");
                        $(".card-with-embedded-doc").each(function () {
                            $(this).find(".js-card-trigger").css("cursor", "pointer")
                            $(this).off("click",".js-card-trigger").on("click",".js-card-trigger", function(event) {
                                event.preventDefault();
                                //this is the current trigger but we use the parent who set the event because it has the data to be used by its children
                                Resources.populateModal(event.delegateTarget);
                            });
                        });
                    }
                },

                populateModal: function(trigger) {

                    /*Set available information (title and go back link)*/
                    ModalWindow.gobackLink.text($(trigger).attr("data-gobacklink"));
                    ModalWindow.title.text($(trigger).attr("data-title"));

                    var url = $(trigger).attr("data-url");
                    /**Fetch the rest of the information: contents of the body */
                    $(".modwin-main-content").load(url, function(responseTxt, statusTxt, xhr) {
                        ModalWindow.open();
                        EventPresentations.init();
                        ImagesSlider.init();
                    });
                },

                filterMenu: {
                    btnsDesktop: $(".filter-btn-desktop"),
                    mainBtn: $(".main-filter-btn"),
                    mainBtnText: $(".main-filter-btn .btn-text"),
                    filterDataValue: $(".main-filter-btn").attr("data-value"),
                    filterDataUrl: $(".main-filter-btn").attr("data-contents-url"),
                    submenu: $(".filter-submenu"),
                    submenuBtns: $(".filter-submenu-btn"),
                    isSubmenuOpen: false,

                    init: function() {
                        App.con("----> Resources filter init");
                        this.addListeners();
                        this.update();
                    },

                    addListeners: function() {
                        App.con("----)))) Resources >> Filter menu is listening");

                        // Desktop filet btns clicked
                        this.btnsDesktop.each(function() {
                            $(this).on("click", Resources.filterMenu.btnClicked);
                        });

                        this.btnsDesktop.each(function() {
                            $(this).on("click", function(event) {
                                // Stop listening for window clicks in the submenu buttons
                                event.stopPropagation();
                            });
                        });

                        this.mainBtn.on("click", Resources.filterMenu.mainBtnClicked);

                        this.submenuBtns.each(function() {
                            $(this).on("click", Resources.filterMenu.btnClicked);
                        });

                        this.submenuBtns.each(function() {
                            $(this).on("click", function(event) {
                                // Stop listening for window clicks in the submenu buttons
                                event.stopPropagation();
                            });
                        });

                    },

                    update: function(elementToUpdate) {
                        let elementToUpdateDataValue = elementToUpdate;

                        // Update main filter btn's data value
                        if (elementToUpdateDataValue !== undefined) {
                            Resources.filterMenu.filterDataValue = elementToUpdateDataValue;
                        }

                        // Hide the button that was clicked from the filter mobile submenu
                        this.submenuBtns.each(function() {
                            let currentBtnDataValue = $(this).attr("data-value");
                            if (currentBtnDataValue == Resources.filterMenu.filterDataValue) {
                                $(this).addClass("hide");
                            } else {
                                $(this).removeClass("hide");
                                $(this).addClass("show");
                            }
                        });

                        // Add and remove select css class from desktop button
                        this.btnsDesktop.each(function() {
                            let currentBtnDataValue = $(this).attr("data-value");
                            if (currentBtnDataValue == Resources.filterMenu.filterDataValue) {
                                $(this).addClass("filter-btn-desktop-selected");
                            } else {
                                $(this).removeClass("filter-btn-desktop-selected");
                            }
                        });


                        var url = Resources.filterMenu.filterDataUrl + Resources.filterMenu.filterDataValue;
                        Resources.cardsContainer.update(url);

                        App.con("----**** Main filter button data-value is : " + Resources.filterMenu.filterDataValue);
                        App.con("----**** Main filter button data-contents-url is : " + Resources.filterMenu.filterDataUrl);
                    },

                    hideSubmenu: function() {
                        Resources.filterMenu.mainBtn.find(".btn-icon").removeClass("icon-sort-up");
                        Resources.filterMenu.mainBtn.find(".btn-icon").addClass("icon-sort-down");
                        Resources.filterMenu.submenu.removeClass("show");
                        Resources.filterMenu.submenu.addClass("hide");
                        Resources.filterMenu.isSubmenuOpen = false;
                    },

                    mainBtnClicked: function(event) {
                        // Stop listening for window clicks in the menu buttons
                        event.stopPropagation();

                        App.con("( 0 ) -> Filter Btn clicked");

                        // Show or hide submenus
                        if (!Resources.filterMenu.isSubmenuOpen) {
                            Resources.filterMenu.submenu.removeClass("hide");
                            Resources.filterMenu.submenu.addClass("show");
                            $(this).find(".btn-icon").removeClass("icon-sort-down");
                            $(this).find(".btn-icon").addClass("icon-sort-up");
                            Resources.filterMenu.isSubmenuOpen = true;
                        } else {
                            Resources.filterMenu.hideSubmenu();
                        }
                    },

                    btnClicked: function(event) {
                        // Stop listening for window clicks in the menu buttons
                        event.stopPropagation();

                        let btnClickedDataValue = $(this).attr("data-value");
                        let btnClickedText = $(this).text();

                        App.con("( 0 ) -> Btn clicked" + " : its data-value is: " + btnClickedDataValue);

                        Resources.filterMenu.mainBtnText.text(btnClickedText);
                        Resources.filterMenu.hideSubmenu();
                        Resources.filterMenu.update(btnClickedDataValue);
                    }
                },

                cardsContainer: {
                    update: function(url) {

                        $(".resources-cards .main-wrap").load(url, function(responseTxt, statusTxt, xhr) {
                            if (statusTxt = "success") {
                                $(document).ready(function() {
                                    Resources.cards.init();
                                });
                            } else $(this).text("Error: The contents are not available now. Please contact us.");
                        })
                    },
                }
            }

            $(document).ready(function() {
                Resources.init();
            });
        })(jQuery);
    });
}());