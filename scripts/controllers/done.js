'use strict';

app.factory('Auth', function(FURL, $firebaseAuth, $firebase) {
	
	var ref = new Firebase(FURL);
	var auth = $firebaseAuth(ref);

	var Auth = {
		user: {},

    createProfile: function(uid, user) {
      var profile = {
        name: user.name,
        email: user.email,
        resume: user.resume,
        experience: user.experience,
        gravatar: get_gravatar(user.email, 40)
      };

      var profileRef = $firebase(ref.child('profile'));
      return profileRef.$set(uid, profile);
    },

    getProfile: function(uid) {
      return $firebase(ref.child('profile').child(uid)).$asObject();
    },

    login: function(user) {
      return auth.$authWithPassword(
        {email: user.email, password: user.password}
      );
    },

    register: function(user) {
      return auth.$createUser({email: user.email, password: user.password, resume: user.resume, experience: user.experience})
        .then(function() {
          console.log(user.resume)
          // authenticate 
          return Auth.login(user);
        })
        .then(function(data) {
          // store user data in Firebase after creating account
          return Auth.createProfile(data.uid, user);
        });
    },

    logout: function() {
      auth.$unauth();
    },

		changePassword: function(user) {      
			return auth.$changePassword({email: user.email, oldPassword: user.oldPass, newPassword: user.newPass});
		},

    signedIn: function() {
      return !!Auth.user.provider;
    },

    requireAuth: function() {
      return auth.$requireAuth();
    }
	};

	auth.$onAuth(function(authData) {
		if(authData) {      
      angular.copy(authData, Auth.user);
      Auth.user.profile = $firebase(ref.child('profile').child(authData.uid)).$asObject();			
		} else {
      if(Auth.user && Auth.user.profile) {
        Auth.user.profile.$destroy();
      }

      angular.copy({}, Auth.user);
		}
	});