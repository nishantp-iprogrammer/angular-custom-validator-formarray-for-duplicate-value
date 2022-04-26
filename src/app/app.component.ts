import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  addDisabled: boolean = true;
  formArray = new FormArray(
    [],
    [
      this.hasDuplicate('inputValue'),
      Validators.pattern(
        '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
      ),
    ]
  );

  ngOnInit() {
    this.addgroup();
  }

  // createGroup(data: any) {
  //   data = data || { inputValue: null };
  //   return new FormGroup({
  //     inputValue: new FormControl(data.inputValue, [
  //       Validators.required,
  //       Validators.pattern(
  //         '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
  //       ),
  //     ]),
  //   });
  // }

  duplicates = [];
  addgroup() {
    this.formArray.push(
      new FormGroup({
        inputValue: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
          ),
        ]),
      })
    );
  }

  removegroup(index) {
    this.formArray.removeAt(index);
  }

  check_value(event: any) {
    console.log(event);
    // console.log(this.formArray.value);
  }

  hasDuplicate(key_form): ValidatorFn {
    return (formArray: FormArray): { [key: string]: any } | null => {
      if (this.duplicates) {
        for (var i = 0; i < this.duplicates.length; i++) {
          let errors =
            (this.formArray.at(this.duplicates[i]).get(key_form)
              .errors as Object) || {};
          delete errors['duplicated'];
          this.formArray
            .at(this.duplicates[i])
            .get(key_form)
            .setErrors(errors as ValidationErrors);
        }
      }

      let dict = {};
      formArray.value.forEach((item, index) => {
        dict[item.inputValue] = dict[item.inputValue] || [];
        dict[item.inputValue].push(index);
      });
      let duplicates = [];
      for (var key in dict) {
        if (dict[key].length > 1) duplicates = duplicates.concat(dict[key]);
      }
      this.duplicates = duplicates;

      for (const index of duplicates) {
        formArray
          .at(+index)
          .get(key_form)
          .setErrors({ duplicated: true });
      }

      return duplicates.length > 0 ? { error: 'Has Duplicate !!!' } : null;
    };
  }

  submit() {
    console.log(this.formArray.value);
  }
}
