from plone.dexterity.browser.view import DefaultView
import re

class DisseminationView(DefaultView):

   def update(self):
      ## Disable all portlets
      super(DefaultView, self).update()
      self.request.set('disable_plone.rightcolumn',1)
      self.request.set('disable_plone.leftcolumn',1)

   def embedded_url(self):
      ## Returns the URL stored in the field embedded_url to be used as the source URL of the video field
      ## If it is not a valid youtube embed URL then convert it
      url = self.context.embedded_url

      ##If it is a Youtube URL, process it to generate the embed URL
      regex = re.compile(r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?(?P<id>[A-Za-z0-9\-=_]{11})')
      match = regex.match(url)
      if match:
         url = "https://www.youtube.com/embed/"+match.group('id')
      return url
