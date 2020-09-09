#from Products.Five.browser import BrowserView
from plone.dexterity.browser.view import DefaultView
import datetime as dt
from plone import api

class ResourceListView(DefaultView):

    def update(self):
        ## Disable all portlets
        super(DefaultView, self).update()
        self.request.set('disable_plone.rightcolumn',1)
        self.request.set('disable_plone.leftcolumn',1)

    def document_resources(self, document_type):
        ## Returns all documents
        results = []
        resources= self.context.portal_catalog({"portal_type":"document",
                                     "sort_on":'created',
                                     "sort_order":"descending",
                                     "review_state":"published"})


        for resource in resources:
            resObj = resource.getObject()
            if resObj.type == document_type:
                results.append({
                    'title': resObj.Title(),
                    'creation_date': resObj.created().strftime('%-d %B %Y'),
                    'absolute_url': resObj.absolute_url(),
                    'downloadfile_url': resObj.absolute_url()+'/@@download/file/',
                    })

        return results

    def past_events(self, event_type):
        ## Returns instances of the type specified by the parameter "event_type" with a date older than today
        ## The parameter "event_type" wull be generic_event or webinar
        resources = api.content.find(
            portal_type=event_type,
            review_state="published",
            end= {'query':dt.datetime.now(),
                  'range':'max'},
            sort_on="start",
            sort_order="descending")

        results = []
        for resource in resources:
            resObj = resource.getObject()
            results.append({
                'title': resObj.Title(),
                'creation_date': resObj.created().strftime('%-d %B %Y'),
                'absolute_url': resObj.absolute_url(),
                'start': resObj.start.strftime('%-d %B %Y')
                })
        return results

    def webinar_resources(self):
        ## Returns webinars with a date older than today
        results = self.past_events("webinar")
        return results

    def generic_events(self):
        ## Returns generic events with a date older than today
        results = self.past_events("generic_event")
        return results

    def techreport_resources(self):
        ## Returns all documents with type field equal to 'Technical report'
        return self.document_resources('Technical report')

    def publication_resources(self):
        ## Returns all documents with type field equal to 'Publication'
        return self.document_resources('Publication')

    def dissemination_resources(self):
        ## Returns all disseminations
        results = []
        resources = api.content.find(context=self.context,
            portal_type='dissemination',
            review_state="published",
            sort_on="created",
            sort_order="descending")
        for resource in resources:
            resObj = resource.getObject()
            results.append({
                'title': resObj.Title(),
                'creation_date': resObj.created().strftime('%-d %B %Y'),
                'absolute_url': resObj.absolute_url()
                })

        return results

