/*!
 * React Firebase Hooks <https://github.com/smujmaiku/react-firebase-hooks>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import React, {
	createContext, useContext, useEffect, useMemo, useCallback,
} from 'react';
import propTypes from 'prop-types';
import { useObject, usePatch, useHelper, usePromise } from 'react-helper-hooks';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

export const firebaseContext = createContext();

/**
 * Use firebase hooks and actions
 * @returns {Array} [
 *   {fire, auth, firestore, storage, functions, ready, currentUser, authId},
 *   {signInGoogle, signOut, addDoc, setDoc, patchDoc, deleteDoc}
 * ]
 */
export function useFirebase() {
	const {
		fire,
		auth,
		firestore,
		storage,
		functions,
		ready,
	} = useContext(firebaseContext)[0];

	const [state, patchState] = usePatch({
		fire,
		auth,
		firestore,
		storage,
		functions,
	});

	useEffect(() => {
		if (!ready) {
			patchState({
				ready: undefined,
			});
		}

		return auth.onAuthStateChanged((user) => {
			const { email } = user || {};
			const authId = (email || '').split('@')[0];

			patchState({
				ready: true,
				currentUser: user,
				authId,
			});
		});
	}, [auth, ready, patchState]);

	const actions = useMemo(() => ({
		signInGoogle: async () => {
			patchState({
				ready: undefined,
			});

			try {
				const provider = new firebase.auth.GoogleAuthProvider();
				const res = await auth.signInWithPopup(provider);
				return res.user;
			} catch (error) {
				patchState({
					ready: true,
					currentUser: undefined,
					authId: undefined,
				});
				return undefined;
			}
		},
		signOut: async () => {
			patchState({
				ready: undefined,
				currentUser: undefined,
				authId: undefined,
			});
			return auth.signOut();
		},
		addDoc: async (path, data) => firestore.collection(path).add(data),
		setDoc: async (path, data) => firestore.doc(path).set(data),
		patchDoc: async (path, data) => firestore.doc(path).set(data, { merge: true }),
		deleteDoc: async (path) => firestore.doc(path).delete(),
		// Include: https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js
		callFunction: async (name, data) => functions.httpsCallable(name)(data),
	}), [auth, firestore, patchState]);

	return [state, actions];
}

/**
 * Get Firestore doc hook
 * @param {string} path
 * @returns {Array} [state, {reload}]
 */
export function useFirestoreDoc(path) {
	const [{ firestore }] = useFirebase();

	const promise = useCallback(async () => {
		const ref = firestore.doc(path);
		const doc = await ref.get();
		return doc.data();
	}, [firestore, path]);

	return usePromise(promise);
}

/**
 * Subscribe Firestore doc hook
 * @param {string} path
 * @returns {Array} [state]
 */
export function useFirestoreDocRT(path) {
	const [{ authId, firestore }] = useFirebase();

	const [state, { reset, resolve, reject }] = useHelper();

	useEffect(() => {
		reset();
		const ref = firestore.doc(path);

		return ref.onSnapshot((doc) => {
			resolve(doc.data());
		}, (error) => {
			reject(error);
		});
	}, [firestore, authId, path, reset, resolve, reject]);

	return [state];
}

/**
 * Apply query to collection
 * @param {Firebase.collectionRef} collectionRef
 * @param {Object} query
 * @param {Array?} query.where
 * @param {Array?} query.orderBy
 * @param {number?} query.limit
 * @returns {Firebase.collectionRef}
 */
export function applyCollectionQuery(collectionRef, query) {
	let ref = collectionRef;
	const { where, orderBy, limit } = query;

	/* eslint-disable no-unmodified-loop-condition */
	while (where instanceof Array && where.length > 0) {
		ref = ref.where(...where.shift());
	}

	while (orderBy instanceof Array && orderBy.length > 0) {
		ref = ref.orderBy(...orderBy.shift());
	}
	/* eslint-enable no-unmodified-loop-condition */

	if (typeof limit === 'number') {
		ref = ref.limit(limit);
	}
	return ref;
}

/**
 * Get Firestore collection hook
 * @param {string} path
 * @param {Object?} query
 * @param {Array?} query.where
 * @param {Array?} query.orderBy
 * @param {number?} query.limit
 * @returns {Array} [state, {reload}]
 */
export function useFirestoreCollection(path, query = {}) {
	const [{ firestore }] = useFirebase();
	const queryData = useObject(query);

	const promise = useCallback(async () => {
		const ref = firestore.collection(path);
		const queryRef = applyCollectionQuery(ref, queryData);
		const collection = await queryRef.get();

		const data = {};
		collection.forEach((doc) => {
			data[doc.id] = doc.data();
		});

		return data;
	}, [path, queryData, firestore]);

	return usePromise(promise);
}

/**
 * Subscribe Firestore collection hook
 * @param {string} path
 * @param {Object?} query
 * @param {Array?} query.where
 * @param {Array?} query.orderBy
 * @param {number?} query.limit
 * @returns {Array} [state]
 */
export function useFirestoreCollectionRT(path, query = {}) {
	const [{ authId, firestore }] = useFirebase();
	const queryData = useObject(query);

	const [state, { reset, resolve, reject }] = useHelper();

	useEffect(() => {
		reset();
		const ref = firestore.collection(path);
		const queryRef = applyCollectionQuery(ref, queryData);

		return queryRef.onSnapshot((snp) => {
			const list = {};
			snp.forEach((doc) => {
				list[doc.id] = doc.data();
			});
			resolve(list);
		}, (error) => {
			reject(error);
		});
	}, [firestore, authId, path, queryData, reset, resolve, reject]);

	return [state];
}

/**
 * Get storage urls
 * @param {Array|Object} files
 * @param {Array} [state]
 */
export function useFirebaseStorageAsUrls(files) {
	const [{ storage }] = useFirebase();

	const fileList = useObject(files);

	const promise = useCallback(async () => {
		const isArray = fileList instanceof Array;
		const map = {};
		for (const [key, file] of Object.entries(fileList)) {
			const url = await storage.ref(file).getDownloadURL();
			map[isArray ? file : key] = url;
		}
		return map;
	}, [fileList, storage]);

	return usePromise(promise);
}

export function FirebaseProvider(props) {
	const { config, children, loadingComponent } = props;

	const value = usePatch();
	const [state, patchState] = value;

	useEffect(() => {
		const fire = firebase.initializeApp(config);
		patchState({
			fire,
			auth: fire.auth(),
			firestore: fire.firestore(),
			storage: fire.storage(),
			functions: fire.functions(),
			ready: true,
		});
	}, [config, patchState]);

	if (!state.fire) return loadingComponent;

	return (
		<firebaseContext.Provider value={[state, patchState]}>
			{children}
		</firebaseContext.Provider>
	);
}

FirebaseProvider.defaultProps = {
	loadingComponent: false,
};

/* eslint-disable react/forbid-prop-types */
FirebaseProvider.propTypes = {
	config: propTypes.object.isRequired,
	children: propTypes.node.isRequired,
	loadingComponent: propTypes.node,
};

export function AuthWall(props) {
	const { children, loadingComponent, promptComponent } = props;
	const [{ ready, currentUser }] = useFirebase();

	if (!ready) {
		return loadingComponent;
	}

	if (!currentUser) {
		return promptComponent;
	}

	return children;
}

AuthWall.defaultProps = {
	promptComponent: false,
	loadingComponent: false,
	verifyFirestore: undefined,
	setupComponent: false,
	denyComponent: false,
};

AuthWall.propTypes = {
	promptComponent: propTypes.node,
	children: propTypes.node.isRequired,
	loadingComponent: propTypes.node,
	verifyFirestore: propTypes.string,
	setupComponent: propTypes.node,
	denyComponent: propTypes.node,
};

export default AuthWall;
