<%@ page import="org.pih.warehouse.core.RoleType" %>
<div style="line-height: 2em; font-size: 9px; color: #999; text-align: center; border-top: 1px solid lightgrey;">
	&copy; 2017 <a href="https://openboxes.com">Powered by OpenBoxes</a> &nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="application.environment.label"/>: <b>${grails.util.Environment.current}</b> &nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="application.version.label"/>: &nbsp;<b><a href="https://github.com/openboxes/openboxes/releases/tag/v${g.meta(name:'info.app.version')}"><g:meta name="info.app.version"/></a></b>&nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="application.buildNumber.label"/>: <b><a href="https://github.com/openboxes/openboxes/commit/${gitProperties?.commitId}">${gitProperties?.shortCommitId}</a></b>&nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="application.buildDate.label"/>: <b>${g.meta(name: "build.time") ?: warehouse.message(code: "application.realTimeBuild.label")}</b>&nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="application.grailsVersion.label"/>: &nbsp; <b><g:meta name="info.app.grailsVersion" /></b>&nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="default.date.label"/>: <b>${new Date() }</b>&nbsp;&nbsp; | &nbsp;&nbsp;
	<warehouse:message code="default.locale.label"/>: &nbsp; <b>${session?.user?.locale }</b>		
</div>
