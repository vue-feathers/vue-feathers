## v0.5.0 - v0.5.1 - 2019-02-09
- ObservableSteam split into Stream singular and Streams plural components
- New ObservableSteam (singular) is aliased as DataStream and will be our only component next release. 
- New ObservableSteams (plural) is the equivalent of the old component and is deprecated (Provided for legacy compatibility) 
- ObservableObject is deprecated
  - The next release will contain only one data provider component.

#### Readme
- Typo fixes
- Updated examples
  - New vue syntax
- (v0.5.1) readme updates for NPM

#### Example Repo
- Full update
  - new component syntax
  - removed significant clutter

---

## v0.4.0 - 2019-01-13
- Mixins now expose the params of find() functions
  - ex. in SteamsMixin, optional second argument to control the parameters of the find() you're subscribed to

---

### v0.3.1-3 - 2019-01-12
- Vue plugin fixes
- Readme updates

---

## v0.3.0 - 2019-01-12
- Readme significantly updated
- Updated stream mixin
- Removed Vue dependency! 🎉
- init changelog