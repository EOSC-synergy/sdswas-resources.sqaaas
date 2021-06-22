from plone.dexterity.browser.view import DefaultView

class DocumentView(DefaultView):

   def update(self):
        ## Disable all portlets
        super(DefaultView, self).update()
        self.request.set('disable_plone.rightcolumn',1)
        self.request.set('disable_plone.leftcolumn',1)

   def view_title(self):
     return self.context.document_type
