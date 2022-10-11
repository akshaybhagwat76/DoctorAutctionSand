import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-consignment-reports',
  templateUrl: './consignment-reports.component.html',
  styleUrls: ['./consignment-reports.component.css']
})
export class ConsignmentReportsComponent implements OnInit {
  isListLoading: boolean = false;
  reportList: any[] = [];
  dateFilter: string = 'past24Hour';
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.listReports();
  }

  listReports() {
    this.isListLoading = true;
    this.adminService.getConsignmentReports(`?date_filter=${this.dateFilter}`).subscribe(
      (success) => {
        this.isListLoading = false;
        console.log(success);
        this.reportList = success.result;
      },
      (error) => {
        this.isListLoading = false;
        console.log(error);
        this.reportList = [];
      }
    );
  }

  exportReports() {
    this.adminService.exportConsignmentReports(`?date_filter=${this.dateFilter}`).subscribe(
      (success) => {
        saveAs(success, new Date().toDateString().split(" ").join("") + '_consignment_report.csv');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  exportBothReports() {
    this.adminService.exportBothReports(`?date_filter=${this.dateFilter}`).subscribe(
      (success) => {
        saveAs(success, new Date().toDateString().split(" ").join("") + '_consignment_report.csv');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleFilterClick(type: string) {
    this.dateFilter = type;
    this.listReports();
  }

}
