import 'package:application/pages/home/home_page.dart';
import 'package:application/pages/login/login_page.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:application/pages/signup/signup_page.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// The project router.
/// When you want to add a new page, please refer his url here.
/// Don't forget to add a goTo**Page function in her _functional file.
final GoRouter router = GoRouter(
  routes: <RouteBase>[
    GoRoute(
      path: '/',
      builder: (BuildContext context, GoRouterState state) {
        return const LoginPage();
      },
      routes: <RouteBase>[
        GoRoute(
          path: 'home',
          builder: (BuildContext context, GoRouterState state) {
            return const HomePage();
          },
        ),
        GoRoute(
            path: 'signup',
            builder: (BuildContext context, GoRouterState state) {
              return const SignupPage();
            }),
        GoRoute(
            path: 'settings',
            builder: (BuildContext context, GoRouterState state) {
              return const SettingsPage();
            })
      ],
    ),
  ],
);
