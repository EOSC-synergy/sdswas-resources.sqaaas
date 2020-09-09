# -*- coding: utf-8 -*-
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import sdswas.resources


class SdswasResourcesLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import plone.restapi
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=sdswas.resources)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'sdswas.resources:default')


SDSWAS_RESOURCES_FIXTURE = SdswasResourcesLayer()


SDSWAS_RESOURCES_INTEGRATION_TESTING = IntegrationTesting(
    bases=(SDSWAS_RESOURCES_FIXTURE,),
    name='SdswasResourcesLayer:IntegrationTesting',
)


SDSWAS_RESOURCES_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(SDSWAS_RESOURCES_FIXTURE,),
    name='SdswasResourcesLayer:FunctionalTesting',
)


SDSWAS_RESOURCES_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        SDSWAS_RESOURCES_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE,
    ),
    name='SdswasResourcesLayer:AcceptanceTesting',
)
