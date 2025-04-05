<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="layout" content="custom" />
    <title><warehouse:message code="auth.signup.label"/></title>
    <script src="${resource(dir:'js/', file:'detect_timezone.js')}" type="text/javascript"></script>
    <g:javascript library="jquery"/>
    <style>
        #hd { display: none; }
        input, select { width: 100%; max-width: 300px; }
        .required { color: red; font-weight: bold; }
        #loginBox { max-width: 600px; margin: 20px auto; padding: 20px; }
        .prop { margin-bottom: 10px; }
        .errors, .message { margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="body">
        <g:form name="handleSignup" controller="auth" action="handleSignup" method="POST">
            <div class="dialog">
                <div id="signupForm">
                    <g:if test="${flash.message}">
                        <div class="message" role="status" aria-label="message">${flash.message}</div>
                    </g:if>

                    <g:hasErrors bean="${userInstance}">
                        <div class="errors" role="alert" aria-label="error-message">
                            <g:renderErrors bean="${userInstance}" as="list" />
                        </div>
                    </g:hasErrors>

                    <div id="loginBox" class="box">
                        <h2>
                            <img src="${resource(dir:'images/icons/silk',file:'lock.png')}" class="middle"/> Signup for an account
                        </h2>
                        <table>
                            <tbody>
                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="firstName"><warehouse:message code="user.firstName.label" default="First Name" /> <span class="required" aria-label="required field">*</span></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'firstName', 'errors')}">
                                        <g:textField name="firstName" value="${userInstance?.firstName}" class="text" size="40"/>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="lastName"><warehouse:message code="user.lastName.label" default="Last Name" /> <span class="required" aria-label="required field">*</span></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'lastName', 'errors')}">
                                        <g:textField name="lastName" value="${userInstance?.lastName}" class="text" size="40"/>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="email"><warehouse:message code="user.email.label" default="Email" /> <span class="required" aria-label="required field">*</span></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'username', 'errors')}">
                                        <g:textField name="email" value="${userInstance?.email}" class="text" size="40"/>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="password"><warehouse:message code="user.password.label" default="Password" /> <span class="required" aria-label="required field">*</span></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'password', 'errors')}">
                                        <g:passwordField name="password" value="${userInstance?.password}" class="text" size="40"/>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="passwordConfirm"><warehouse:message code="user.confirmPassword.label" default="Confirm Password" /> <span class="required" aria-label="required field">*</span></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'passwordConfirm', 'errors')}">
                                        <g:passwordField name="passwordConfirm" value="${userInstance?.passwordConfirm}" class="text" size="40"/>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="locale"><warehouse:message code="default.locale.label"/></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'locale', 'errors')}">
                                        <g:selectLocale name="locale" value="${params?.locale?:userInstance?.locale}" noSelection="['':'']" class="chzn-select-deselect"/>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right">
                                        <label for="timezone"><warehouse:message code="default.timezone.label" default="Timezone" /></label>
                                    </td>
                                    <td class="value ${hasErrors(bean: userInstance, field: 'timezone', 'errors')}">
                                        <g:selectTimezone id="timezone" name="timezone" value="${params?.timezone?:userInstance?.timezone}" noSelection="['':'']" class="chzn-select-deselect"/>
                                    </td>
                                </tr>

                                <g:if test="${grailsApplication.config.openboxes.signup.additionalQuestions.enabled}">
                                    <g:each var="question" in="${grailsApplication.config.openboxes.signup.additionalQuestions.content}">
                                        <tr class="prop">
                                            <td class="name">
                                                <label for="${question.id}">${question.label}</label>
                                            </td>
                                            <td class="value">
                                                <g:if test="${question.options}">
                                                    <g:set var="questionKey" value="additionalQuestions.${question.id}"/>
                                                    <g:set var="selectedKey" value="${params[questionKey]}"/>
                                                    <select name="${questionKey}" class="chzn-select-deselect">
                                                        <g:each var="option" in="${question.options}">
                                                            <g:if test="${option.key == selectedKey}">
                                                                <option value="${option.key}" selected>${option.value}</option>
                                                            </g:if>
                                                            <g:else>
                                                                <option value="${option.key}">${option.value}</option>
                                                            </g:else>
                                                        </g:each>
                                                    </select>
                                                </g:if>
                                            </td>
                                        </tr>
                                    </g:each>
                                </g:if>

                                <tr class="prop">
                                    <td class="name">
                                        <label for="additionalQuestions.comments"><warehouse:message code="default.comments.label" default="Comments" /></label>
                                    </td>
                                    <td class="value">
                                        <g:textArea name="additionalQuestions.comments" rows="5" class="text large" placeholder="Tell us more about yourself. What features are important to you? Do you need help getting started?">${params?.comments}</g:textArea>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name middle right"></td>
                                    <td class="value">
                                        <button type="submit" class="button block">
                                            <img src="${resource(dir:'images/icons/silk',file:'accept.png')}" class="middle"/>
                                            <warehouse:message code="auth.signup.label"/>
                                        </button>
                                    </td>
                                </tr>

                                <tr class="prop">
                                    <td class="name"></td>
                                    <td class="value">
                                        <warehouse:message code="auth.alreadyHaveAccount.text"/>
                                        <g:link class="list" controller="auth" action="login">
                                            <warehouse:message code="auth.login.label" default="Login"/>
                                        </g:link>
                                        <div class="right">
                                            <span class="required" aria-label="required field">*</span> denotes required fields
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </g:form>
    </div>

    <script>
        $(document).ready(function() {
            // Timezone detection
            var timezone = jzTimezoneDetector.determine_timezone().timezone;
            if (timezone) {
                $("#timezone").val(timezone.olson_tz).trigger("chosen:updated");
            }

            // Client-side validation
            $("#handleSignup").submit(function(event) {
                var email = $("#email").val();
                var password = $("#password").val();
                var passwordConfirm = $("#passwordConfirm").val();
                var firstName = $("#firstName").val();
                var lastName = $("#lastName").val();

                if (!firstName.trim()) {
                    alert("First Name is required.");
                    event.preventDefault();
                    return false;
                }
                if (!lastName.trim()) {
                    alert("Last Name is required.");
                    event.preventDefault();
                    return false;
                }
                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    alert("Please enter a valid email address.");
                    event.preventDefault();
                    return false;
                }
                if (password.length < 6) {
                    alert("Password must be at least 6 characters long.");
                    event.preventDefault();
                    return false;
                }
                if (password !== passwordConfirm) {
                    alert("Passwords do not match.");
                    event.preventDefault();
                    return false;
                }
            });
        });
    </script>
</body>
</html>