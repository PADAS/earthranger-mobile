// External Dependencies
import React, {
  useEffect, useRef, useState,
} from 'react';
import {
  View, Text, TextInput, Pressable, Keyboard,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import NetInfo from '@react-native-community/netinfo';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { isEmpty, defaultTo } from 'lodash-es';

// Internal Dependencies
import {
  NETWORK_ERROR,
  IS_ANDROID,
  REMEMBER_ME_CHECKBOX_KEY,
  SITE_VALUE_KEY,
  USER_NAME_KEY,
} from '../../../../common/constants/constants';
import { SITE, assignCurrentSiteName } from '../../../../api/EarthRangerService';
import { createLoginErrorEvent } from '../../../../analytics/login/loginAnalytics';
import { getSecuredStringForKey, setSecuredStringForKey } from '../../../../common/data/storage/utils';
import { getBoolForKey, setBoolForKey } from '../../../../common/data/storage/keyValue';
import AnalyticsEvent from '../../../../analytics/model/analyticsEvent';
import { EyeIcon } from '../../../../common/icons/EyeIcon';
import { EyeOffIcon } from '../../../../common/icons/EyeOffIcon';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

// Styles
import style from './LoginForm.styles';

// Interfaces + Types
interface LoginFormProps {
  internetErrorMessage: string;
  loginError?: AxiosError;
  trackAnalyticsEvent: (event: AnalyticsEvent) => void;
  login: any;
  userAccountErrorMessage: string;
  onSubmit: () => void;
}

interface FormValues {
  siteName: string;
  userName: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Login Form
 * @param LoginFormProps
 * @returns JSX
 */
const LoginForm = ({
  internetErrorMessage,
  loginError,
  trackAnalyticsEvent,
  login,
  userAccountErrorMessage,
  onSubmit,
}: LoginFormProps) => {
  // References
  const refSiteName = useRef<TextInput>(null);
  const refUsername = useRef<TextInput>(null);
  const refPassword = useRef<TextInput>(null);
  const isLoading = useRef<boolean>(false);

  // Component's State
  const [siteName] = useState(defaultTo(getSecuredStringForKey(SITE_VALUE_KEY), ''));
  const [userName] = useState(defaultTo(getSecuredStringForKey(USER_NAME_KEY), ''));
  const [rememberMe] = useState(Boolean(defaultTo(getBoolForKey(REMEMBER_ME_CHECKBOX_KEY), false)));
  const [internetErrorMsg, setInternetErrorMsg] = useState('');
  const [siteNameErrorMessage, setSiteNameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Utility Functions
  const persistLoginFields = (values: FormValues) => {
    setSecuredStringForKey(SITE_VALUE_KEY, values.siteName.trim());
    setSecuredStringForKey(USER_NAME_KEY, values.userName.trim());
  };

  const persistRememberMe = (isChecked: boolean) => {
    setBoolForKey(REMEMBER_ME_CHECKBOX_KEY, isChecked);
  };

  const clearPersistedLoginFields = (value: boolean) => {
    setSecuredStringForKey(SITE_VALUE_KEY, '');
    setSecuredStringForKey(USER_NAME_KEY, '');
    persistRememberMe(value);
  };

  // Hooks
  const { t } = useTranslation();

  // Handlers

  const handleError = (error: AxiosError) => {
    if (error.message === NETWORK_ERROR) {
      setSiteNameErrorMessage(t('loginView.invalidSiteName'));
      setPasswordErrorMessage('');
    } else if (error.response?.status === 400) {
      setSiteNameErrorMessage('');
      setPasswordErrorMessage(t('loginView.incorrectCredentialsMessage'));
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    Keyboard.dismiss();
    const networkAvailable = await NetInfo.fetch();

    /* istanbul ignore next */
    if (!networkAvailable.isInternetReachable) {
      isLoading.current = false;
      setInternetErrorMsg(t('loginView.internetConnectionNeeded'));
      return;
    }

    onSubmit();
    persistRememberMe(values.rememberMe);
    persistLoginFields(values);
    assignCurrentSiteName();
    login(values.userName.trim(), values.password.trim());
    isLoading.current = false;
  };

  // Login Schema
  const LoginSchema = Yup.object().shape({
    siteName: Yup.string()
      .trim()
      .required(t('loginView.requiredField')),
    userName: Yup.string()
      .trim()
      .required(t('loginView.requiredField')),
    password: Yup.string()
      .trim()
      .required(t('loginView.requiredField')),
  });

  // Component's Life-cycle

  useEffect(() => {
    setInternetErrorMsg(internetErrorMessage);
  }, [internetErrorMessage]);

  useEffect(() => {
    if (loginError) {
      trackAnalyticsEvent(createLoginErrorEvent());
      handleError(loginError);
      setSecuredStringForKey(SITE_VALUE_KEY, '');
    } else {
      setSiteNameErrorMessage('');
      setPasswordErrorMessage('');
    }
  }, [loginError]);

  return (
    <Formik
      initialValues={{
        siteName, userName, password: '', rememberMe,
      }}
      validationSchema={LoginSchema}
      onSubmit={(values: FormValues) => handleFormSubmit(values)}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        isValid,
        dirty,
      }) => (
        <>
          {/* Site Name */}
          <View>
            <Text style={style.text}>{t('loginView.siteNameLabel')}</Text>
            <View style={style.row}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                onChangeText={handleChange('siteName')}
                onSubmitEditing={() => {
                  refUsername.current?.focus();
                }}
                ref={refSiteName}
                returnKeyType="next"
                style={[
                  style.textInput,
                  style.textInputSiteName,
                  errors.siteName && touched.siteName ? style.textInputError : null,
                ]}
                testID="LoginView-SiteName"
                value={values.siteName.trim()}
                accessibilityLabel="Site Name"
                onFocus={() => {
                  setSiteNameErrorMessage('');
                }}
              />
              <Text style={[style.text, style.textSiteName]}>{SITE.domain}</Text>
            </View>

            {errors.siteName && touched.siteName && isEmpty(siteNameErrorMessage) ? (
              <Text style={style.textInputErrorText}>{errors.siteName}</Text>
            ) : null}

            {!isEmpty(siteNameErrorMessage)
              && <Text style={style.textInputErrorText}>{siteNameErrorMessage}</Text>}
          </View>
          {/* End Site Name */}

          {/* User Name */}
          <Text style={style.text}>{t('loginView.usernameLabel')}</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            onChangeText={handleChange('userName')}
            onSubmitEditing={() => {
              refPassword.current?.focus();
            }}
            ref={refUsername}
            returnKeyType="next"
            style={[
              style.textInput,
              errors.userName && touched.userName ? style.textInputError : null,
            ]}
            testID="LoginView-Username"
            value={values.userName.trim()}
            accessibilityLabel="User Name"
          />

          {(errors.userName || userAccountErrorMessage) && touched.userName ? (
            <Text style={style.textInputErrorText}>
              {userAccountErrorMessage || errors.userName }
            </Text>
          ) : null}
          {/* End User Name */}

          {/* Password */}
          <View>
            <Text style={style.text}>{t('loginView.passwordLabel')}</Text>
            <View style={style.row}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                onChangeText={handleChange('password')}
                onSubmitEditing={handleSubmit}
                ref={refPassword}
                returnKeyType="next"
                secureTextEntry={!showPassword}
                style={[
                  style.textInput,
                  style.textInputWithIcon,
                  errors.password && touched.password ? style.textInputError : null,
                ]}
                testID="LoginView-Password"
                value={values.password.trim()}
                accessibilityLabel="Password"
                onFocus={() => {
                  setPasswordErrorMessage('');
                }}
              />
              <Pressable
                testID="LoginView-Password-Button"
                onPress={() => setShowPassword(!showPassword)}
              >
                <View style={[style.icon, style.passwordIcon]}>
                  {!showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </View>
              </Pressable>
            </View>

            {errors.password && touched.password && isEmpty(passwordErrorMessage) ? (
              <Text style={style.textInputErrorText}>{errors.password}</Text>
            ) : null}

            {!isEmpty(passwordErrorMessage) && (
              <Text style={style.textInputErrorText}>{passwordErrorMessage}</Text>
            )}
          </View>
          {/* End Password */}

          {/* Internet Conection Error Message */}
          {
            !isEmpty(internetErrorMsg) && (
              <Text style={style.errorText}>{internetErrorMsg}</Text>
            )
          }
          {/* End Internet Conection Error Message */}

          {/* Remember Me? */}
          <View style={[style.row, style.checkboxContainer]}>
            <CheckBox
              value={values.rememberMe}
              tintColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
              onCheckColor={COLORS_LIGHT.white}
              onFillColor={COLORS_LIGHT.brightBlue}
              boxType="square"
              testID="LoginView-RememberMe"
              tintColors={{ true: COLORS_LIGHT.brightBlue }}
              disabled={false}
              onValueChange={(value: boolean) => {
                setFieldValue('rememberMe', value);
                if (!value) {
                  clearPersistedLoginFields(value);
                } else {
                  persistRememberMe(value);
                  persistLoginFields(values);
                }
              }}
              style={IS_ANDROID ? style.checkboxAndroid : style.checkboxiOS}
              accessibilityLabel="Remember Me"
            />
            <Text style={style.checkboxLabel}>{t('loginView.checkBoxText')}</Text>
          </View>
          {/* End Remember Me? */}

          {/* Submit Button */}
          <View style={style.buttonContainer}>
            <Pressable style={[style.button, (!isValid || !dirty) ? style.buttonDisabled : null]} onPress={handleSubmit} testID="LoginView-LoginButton" disabled={!isValid || !dirty}>
              <Text
                style={style.textButton}
                accessibilityLabel="Log In"
              >
                {t('loginView.loginButtonText')}
              </Text>
            </Pressable>
          </View>
          {/* End Submit Button */}
        </>
      )}
    </Formik>
  );
};

export { LoginForm };
