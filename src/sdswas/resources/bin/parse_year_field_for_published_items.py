### This script processes all PUBLISHED (it has no privileges to access unpublished items)
### contents of type "dissemination" and "document" of these package

### For each content, the "year" field (which is a Date field) is modified to store the year only (from the format  to the year)

def main(app):
    site = app.Plone
    items = site.portal_catalog({"portal_type" : ["dissemination", "document"]})
    print(len(items), " found")
    for item in items:
        obj = item.getObject()
        formatted_year = obj.year.strftime('%Y')
        print("item title:", obj.Title()," - year changed from: ",  obj.year, " to: ", formatted_year)
        obj.year = formatted_year

# If this script lives in your source tree, then we need to use this trick so that
# five.grok, which scans all modules, does not try to execute the script while
# modules are being loaded on the start-up
if "app" in locals():
    main(app)

# Commit transaction
import transaction; transaction.commit()
# Perform ZEO client synchronization (if running in clustered mode)
#app._p_jar.sync()