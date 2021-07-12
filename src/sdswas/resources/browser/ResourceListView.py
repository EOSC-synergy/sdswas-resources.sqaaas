from plone.dexterity.browser.view import DefaultView
import datetime as dt
from plone import api
from plone.batching import Batch

class ResourceListView(DefaultView):

    def document_resources(self, document_type, b_size, b_start):
        ## Returns all documents
        results = []
        resources= self.context.portal_catalog({"portal_type":"document",
                                     "sort_on":'created',
                                     "sort_order":"descending",
                                     "review_state":"published"})


        for resource in resources:
            resObj = resource.getObject()
            if resObj.document_type == document_type:
                year = resObj.year
                if year:
                    year = year.strftime('%Y')
                    author = resObj.author
                    if author: year = author + ", " + year

                results.append({
                    'title': resObj.Title(),
                    'creation_date': resObj.created().strftime('%-d %B %Y'),
                    'absolute_url': resObj.absolute_url(),
                    'downloadfile_url': resObj.absolute_url()+'/@@download/file/',
                    'year': year
                    })
        results = Batch(results, size=b_size, start=b_start, orphan=0)
        return results

    def past_events(self, event_type, b_size, b_start):
        ## Returns instances of the type specified by the parameter "event_type" with a date older than today
        ## The parameter "event_type" wull be generic_event or webinar

        searchParams = {
            "portal_type": [event_type],
            "review_state": "published",
            "end": {'query':dt.datetime.now(),
                    'range':'max'},
            "sort_on": ["start", "sortable_title"],
            "sort_order": ["descending", "ascending"]
        }

        resources = self.context.portal_catalog(searchParams)
        results = []
        for resource in resources:
            resObj = resource.getObject()

            ##The field 'presented_by' in generic events does not contain the speaker but the organiser. Thus, do not include it in the card
            ##The field has to be added to all the entries of the results set
            presented_by = resObj.presented_by if event_type == "webinar" else None

            results.append({
                'title': resObj.Title(),
                'creation_date': resObj.created().strftime('%-d %B %Y'),
                'absolute_url': resObj.absolute_url(),
                'start': resObj.start.strftime('%-d %B %Y'),
                'presented_by': presented_by
                })

        results = Batch(results, size=b_size, start=b_start, orphan=0)

        return results

    def webinar_resources(self, b_size, b_start):
        ## Returns webinars with a date older than today
        results = self.past_events("webinar", b_size, b_start)
        return results

    def generic_events(self, b_size, b_start):
        ## Returns generic events with a date older than today
        results = self.past_events("generic_event", b_size, b_start)
        return results

    def techreport_resources(self, b_size, b_start):
        ## Returns all documents with type field equal to 'Technical report'
        return self.document_resources('Technical report', b_size, b_start)

    def publication_resources(self, b_size, b_start):
        ## Returns all documents with type field equal to 'Publication'
        start = dt.datetime.now()
        results = self.document_resources('Publication', b_size, b_start)
        delta = dt.datetime.now()-start
        return results

    def dissemination_resources(self, b_size, b_start):
        ## Returns all disseminations
        results = []
        resources = api.content.find(context=self.context,
            portal_type='dissemination',
            review_state="published",
            sort_on="created",
            sort_order="descending")
        for resource in resources:
            resObj = resource.getObject()
            year = resObj.year
            if year: year = year.strftime('%Y')
            results.append({
                'title': resObj.Title(),
                'creation_date': resObj.created().strftime('%-d %B %Y'),
                'absolute_url': resObj.absolute_url(),
                'year': year
                })

        results = Batch(results, size=b_size, start=b_start, orphan=0)

        return results

    def listbytype_viewname(self):
        portal = api.portal.get()
        return portal.absolute_url()+"/resources/@@resourceslist_"

    def resources_url(self):
        portal = api.portal.get()
        return portal.absolute_url()+"/resources/"
