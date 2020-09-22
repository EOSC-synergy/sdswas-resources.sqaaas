/**
 * Events of the modal window (id '#full_view') that is used to display
 * the full view of the items in the page template eventslist_view.pt
 * */

(function($) {
    $(function() {

        var Resources = {

            initNavigation: function(){

                //this.hidePreloader();

                $(".btn").click(function(){
                    Resources.populateSection($(this).data('value'));
                });

                $("#publications").trigger("click");

            },
            populateSection: function (sectionId) {
                //this.showPreloader();
                var url = window.location.href+"/resourceslist_contents/ #"+sectionId;
                $("#resource-cards").load(url, function(responseTxt, statusTxt, xhr) {
                    //Resources.hidePreloader();
                    if (statusTxt = "success") $("#resource-cards").show();
                    else $(this).text("Error: The contents are not available now. Please contact us.");
                })
            },
            initFullViewModal: function(){

                $('#full_view').on('show.bs.modal', function(e) {

                    var $trigger = $(e.relatedTarget);

                    //Set parametrized GO BACK link
                    $(this).find('.go_back_link').text($trigger.data("goback-link"));

                    //Set initial content: title and a loader icon
                    $(this).find('#title').text($trigger.data("title"));
                    $(this).find('#preloader').show().delay(5000).fadeOut(100);

                    /*Set URL to download document if content type is Document*/
                    var button = $(this).find('#download-doc');
                    if ($trigger.data("is-document")){
                        var doc_url = $trigger.data('url')+'/@@download/file/';
                        button.find('a').data('href',doc_url)
                        button.show();
                    }
                    else {
                        button.hide();
                    }

                    $(this).modal({ show: true });

                    try {
                        //Use Ajax to fetch content from element #main-container of the remote URL
                        var dataURL = $trigger.data('url') + " #main-container";
                        $(this).find('#contents').load(dataURL, function(responseTxt, statusTxt, xhr) {

                            if (statusTxt = "success") $("#full_view").modal({ show: true });
                            else $(this).text("Error: The contents are not available now. Please contact us.");
                            $("#full_view").find('#preloader').hide();

                        });
                    } catch (error) {
                        alert("Error: The contents are not available now. Please contact us.");
                        $("#full_view").find('#preloader').hide();
                    }
                })

                $('#full_view').on('hidden.bs.modal', function(e) {
                    $(this).find('#contents').text("");
                    $(this).find('#title').text("");
                });

                $('.open_full_view').click(function(){
                    $('#full_view').modal("show");
                });


            },

        }

        $(document).ready(function() {
            Resources.initNavigation();
            Resources.initFullViewModal();
        });

    });

})(jQuery);