import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator'; // make sure that only uploade image
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
export interface StatePovinces {
  name: string;
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
/** post will be create  */
export class PostCreateComponent implements OnInit, OnDestroy {
  id: string | null | undefined;
  imagePreview?: ArrayBuffer | null | string;
  isLoading = false;
  form!: FormGroup;
  hovered = 0;
  readonly = false;
  private mode = 'create';
  private postId: string | null | undefined;
  post?: Post | any | undefined;
  protected stateProvinces: StatePovinces[] = [];
  private countries: any;
  protected countryInfo = new Map<string, StatePovinces[]>();
  protected contires: string[] = [];
  protected cities: StatePovinces[] = [];
  countryName!: string;
  private authStatusSub!: Subscription;
  dateFormat: any;
  // the array from tropic
  selectTitles: any[] = [
    { name: 'Transport' },
    { name: 'Society' },
    { name: 'Cultur' },
    { name: 'Natur' },
    { name: 'Economic' },
    { name: 'Others' },
  ];

  /**
   *
   * @param postsService  add a new post
   * @param config rating option with the star mode
   */
  constructor(
    public postsService: PostsService,
    config: NgbRatingConfig,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {
    config.max = 5;
  }

  /**
   *
   * @param form  NgForm value
   * @returns  if form is invalid empty value else add new post
   *
   */
  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    const today = new Date();
    console.log(today);
    this.dateFormat =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate() +
      '  ' +
      today.getHours() +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds();

    this.isLoading = true;
    if (this.mode === 'create') {
      // console.log('topic:', this.sletectedTopic);
      this.postsService.addPost(
        this.form.value.country,
        this.form.value.city,
        this.form.value.topic,
        this.form.value.rate,
        this.form.value.image,
        this.form.value.content,
        this.form.value.subtitel,
        this.dateFormat
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.country,
        this.form.value.city,
        this.form.value.topic,
        this.form.value.rate,
        this.form.value.image,
        this.form.value.content,
        this.form.value.subtitel,
        this.dateFormat
      );
    }
    this.form.reset(); // after post was added will reset the formulat
  }
  /** show icon from the rate star */
  showIcon(index: number) {
    if (3 >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  /**uploade the image */
  onImagePicked(event: Event) {
    const file = (<any>event.target).files[0]; // convert into html input element
    this.form.patchValue({ image: file }); // target the single contro
    this.form.get('image')?.updateValueAndValidity(); // update the value
    //console.log(file);
    //console.log(this.form);
    const reader = new FileReader(); // coverte image into url
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * on init will be read the data from the
   *  json file and add into a map list
   */

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      country: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      topic: new FormControl(null, { validators: [Validators.required] }),
      rate: new FormControl(1, { validators: [Validators.required] }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      subtitel: new FormControl(null, { validators: [Validators.required] }),
      // make sure that only image rae validate
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    fetch('./assets/countryState.json') // get the country name from the json data
      .then((res) => res.json())
      .then((jsonData) => {
        this.countries = jsonData;
        for (const key in this.countries) {
          if (Object.prototype.hasOwnProperty.call(this.countries, key)) {
            const element = this.countries[key];
            this.contires.push(element.name); // add the country name to a array
            this.countryInfo.set(element.name, element.stateProvinces); // add country with the city
          }
        }
      });

    // get th id fromt he post
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        // console.log('parameter map ', paramMap);
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        // return a generic object (post)
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            country: postData.country,
            city: postData.city,
            topic: postData.topic,
            rate: postData.rate,
            imagePath: postData.imagePath,
            content: postData.content,
            subtitel: postData.subtitel,
            creator: postData.creator,
          };
          this.form?.setValue({
            country: this.post.country,
            city: this.post.city,
            topic: this.post.topic,
            rate: this.post.rate,
            image: this.post.imagePath,
            content: this.post.content,
            subtitel: this.post.subtitel,
          });
          //  console.log('this is creator id', this.post.creator); // getting the creator id
        });

        // console.log('this post from edit', this.post);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

    // get the observable
  }

  /** get city from the country*/
  getCitiesFromCountry(country: string) {
    this.countryInfo.forEach((value, key) => {
      if (key === country) {
        // console.log(value);
        this.cities = value;
      }
    });

    return this.cities;
  }

  /**
   *
   * @returns the map list from counties
   */
  // getBindedCountryInfo() {
  //   return this.countryInfo;
  // }

  getCountriesList() {
    return this.contires;
  }

  // getCitiesList() {
  //   return this.cities;
  // }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
